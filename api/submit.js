const multer = require('multer');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const path = require('path');

// Configuração do banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use apenas PDF, DOC ou DOCX.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para inserir candidato no banco
async function insertCandidate(nome, sobrenome, email, telefone, pais, cargo, alertas, curriculo_nome) {
  const query = `
    INSERT INTO candidatos (nome, sobrenome, email, telefone, pais, cargo, alertas, curriculo_nome, data_candidatura)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING id;
  `;
  const values = [nome, sobrenome, email, telefone, pais, cargo, alertas, curriculo_nome];
  
  const result = await pool.query(query, values);
  return result.rows[0].id;
}

// Middleware para processar multipart/form-data
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Processar upload do arquivo
    await runMiddleware(req, res, upload.single('curriculo'));

    const { nome, sobrenome, email, telefone, pais, cargo, alertas } = req.body;
    const curriculo = req.file;

    // Validações básicas
    if (!nome || !sobrenome || !email || !telefone || !pais || !cargo) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    if (!curriculo) {
      return res.status(400).json({ error: 'Currículo é obrigatório.' });
    }

    // Inserir no banco de dados
    const candidatoId = await insertCandidate(
      nome, sobrenome, email, telefone, pais, cargo, 
      alertas === 'on', curriculo.originalname
    );

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Nova Candidatura - ${cargo}`,
      html: `
        <h2>Nova Candidatura Recebida</h2>
        <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>País:</strong> ${pais}</p>
        <p><strong>Cargo:</strong> ${cargo}</p>
        <p><strong>Aceita alertas:</strong> ${alertas === 'on' ? 'Sim' : 'Não'}</p>
        <p><strong>ID do Candidato:</strong> ${candidatoId}</p>
      `,
      attachments: [{
        filename: curriculo.originalname,
        content: curriculo.buffer
      }]
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Candidatura enviada com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao processar candidatura:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor. Tente novamente mais tarde.' 
    });
  }
}