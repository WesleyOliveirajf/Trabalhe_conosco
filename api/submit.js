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
const transporter = nodemailer.createTransport({  // ← MUDANÇA AQUI (removido 'r')
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

  console.log('=== INÍCIO DO PROCESSAMENTO ===');
  console.log('Headers:', req.headers);
  console.log('Environment variables check:');
  console.log('- POSTGRES_URL:', process.env.POSTGRES_URL ? 'Configurado' : 'NÃO CONFIGURADO');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Configurado' : 'NÃO CONFIGURADO');
  console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'Configurado' : 'NÃO CONFIGURADO');
  console.log('- EMAIL_TO:', process.env.EMAIL_TO ? 'Configurado' : 'NÃO CONFIGURADO');

  try {
    // Processar upload do arquivo
    console.log('Processando upload do arquivo...');
    await runMiddleware(req, res, upload.single('curriculo'));
    console.log('Upload processado com sucesso');

    const { nome, sobrenome, email, telefone, pais, cargo, alertas } = req.body;
    const curriculo = req.file;

    console.log('Dados recebidos:', { nome, sobrenome, email, telefone, pais, cargo, alertas });
    console.log('Arquivo recebido:', curriculo ? { name: curriculo.originalname, size: curriculo.size } : 'Nenhum arquivo');

    // Validações básicas
    if (!nome || !sobrenome || !email || !telefone || !pais || !cargo) {
      console.log('Erro: Campos obrigatórios não preenchidos');
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    if (!curriculo) {
      console.log('Erro: Currículo não enviado');
      return res.status(400).json({ error: 'Currículo é obrigatório.' });
    }

    // Verificar variáveis de ambiente críticas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.log('Erro: Variáveis de email não configuradas');
      return res.status(500).json({ error: 'Configuração de email incompleta. Contate o administrador.' });
    }

    if (!process.env.POSTGRES_URL) {
      console.log('Erro: POSTGRES_URL não configurado');
      return res.status(500).json({ error: 'Configuração de banco de dados incompleta. Contate o administrador.' });
    }

    // Inserir no banco de dados
    console.log('Inserindo candidato no banco de dados...');
    const candidatoId = await insertCandidate(
      nome, sobrenome, email, telefone, pais, cargo, 
      alertas === 'on', curriculo.originalname
    );
    console.log('Candidato inserido com ID:', candidatoId);

    // Enviar email
    console.log('Preparando envio de email...');
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

    console.log('Enviando email para:', process.env.EMAIL_TO);
    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso!');

    console.log('=== PROCESSAMENTO CONCLUÍDO COM SUCESSO ===');
    res.status(200).json({ 
      success: true, 
      message: 'Candidatura enviada com sucesso!' 
    });

  } catch (error) {
    console.error('=== ERRO DURANTE O PROCESSAMENTO ===');
    console.error('Tipo do erro:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    
    // Tratamento específico de erros
    let errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    
    if (error.message.includes('authentication') || error.message.includes('Invalid login')) {
      errorMessage = 'Erro de autenticação do email. Verifique as credenciais.';
    } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } else if (error.message.includes('Tipo de arquivo')) {
      errorMessage = error.message;
    } else if (error.message.includes('File too large')) {
      errorMessage = 'Arquivo muito grande. O tamanho máximo é 5MB.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}