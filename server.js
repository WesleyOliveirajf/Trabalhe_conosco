const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./candidatos.db', (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite.');
  }
});

// Criar tabela de candidatos se não existir
db.run(`CREATE TABLE IF NOT EXISTS candidatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  pais TEXT NOT NULL,
  curriculo_nome TEXT,
  data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela:', err.message);
  } else {
    console.log('✅ Tabela de candidatos pronta.');
  }
});

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de arquivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.doc', '.docx', '.pdf', '.txt'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use apenas .DOC, .DOCX, .PDF ou .TXT'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // E-mail remetente da Torp
    pass: process.env.EMAIL_PASS  // Senha de aplicativo
  }
  // IMPORTANTE: Configure as variáveis de ambiente no arquivo .env:
  // EMAIL_USER=seu-email@gmail.com
  // EMAIL_PASS=sua-senha-de-aplicativo
  // EMAIL_TO=destinatario@empresa.com
  // Consulte CONFIGURACAO_EMAIL.md para mais detalhes
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para visualizar candidatos (painel administrativo)
app.get('/admin/candidatos', (req, res) => {
  db.all('SELECT * FROM candidatos ORDER BY data_envio DESC', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar candidatos:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar candidatos' });
    }
    
    // Gerar HTML para visualização
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel Administrativo - Candidatos</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            .stats { display: flex; gap: 20px; margin-bottom: 30px; }
            .stat-card { background: #007bff; color: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; }
            .stat-number { font-size: 2em; font-weight: bold; }
            .stat-label { font-size: 0.9em; opacity: 0.9; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:hover { background-color: #f5f5f5; }
            .id-badge { background: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
            .country-flag { font-size: 1.2em; margin-right: 5px; }
            .date { color: #666; font-size: 0.9em; }
            .no-data { text-align: center; color: #666; padding: 40px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏢 Painel Administrativo - Candidatos Torp</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${rows.length}</div>
                    <div class="stat-label">Total de Candidatos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${rows.filter(r => r.data_envio.includes(new Date().toISOString().split('T')[0])).length}</div>
                    <div class="stat-label">Hoje</div>
                </div>
            </div>
            
            ${rows.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome Completo</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>País</th>
                        <th>Currículo</th>
                        <th>Data de Envio</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(row => `
                    <tr>
                        <td><span class="id-badge">#${row.id}</span></td>
                        <td><strong>${row.nome} ${row.sobrenome}</strong></td>
                        <td><a href="mailto:${row.email}">${row.email}</a></td>
                        <td>${row.telefone}</td>
                        <td>${row.pais}</td>
                        <td>${row.curriculo_nome}</td>
                        <td class="date">${new Date(row.data_envio).toLocaleString('pt-BR')}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">📋 Nenhum candidato encontrado.</div>'}
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
  });
});

// Rota para buscar candidatos em JSON (API)
app.get('/api/candidatos', (req, res) => {
  db.all('SELECT * FROM candidatos ORDER BY data_envio DESC', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar candidatos:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar candidatos' });
    }
    res.json({ candidatos: rows, total: rows.length });
  });
});

// Rota para processar o formulário
app.post('/enviar-candidatura', upload.single('curriculo'), async (req, res) => {
  try {
    const { nome, sobrenome, email, telefone, pais } = req.body;
    const curriculo = req.file;

    // Validação dos campos obrigatórios
    if (!nome || !sobrenome || !email || !telefone || !pais || !curriculo) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios, incluindo o currículo.'
      });
    }

    // Salvar dados no banco de dados
    const candidatoId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO candidatos (nome, sobrenome, email, telefone, pais, curriculo_nome) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, sobrenome, email, telefone, pais, curriculo.originalname],
        function(err) {
          if (err) {
            console.error('Erro ao salvar candidato no banco:', err.message);
            reject(err);
          } else {
            console.log(`✅ Candidato salvo no banco com ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });

    // Configuração do e-mail
    const mailOptions = {
      from: email, // E-mail do candidato
      to: process.env.EMAIL_TO, // E-mail do RH da Torp
      subject: `Nova Candidatura #${candidatoId}: ${nome} ${sobrenome} - ${pais}`,
      html: `
        <h2>Nova Candidatura Recebida</h2>
        <p><strong>ID:</strong> #${candidatoId}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Sobrenome:</strong> ${sobrenome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>País:</strong> ${pais}</p>
        <br>
        <p>O currículo do candidato está anexado a este e-mail.</p>
        <p><em>Dados salvos automaticamente no sistema.</em></p>
      `,
      attachments: [
        {
          filename: curriculo.originalname,
          path: curriculo.path
        }
      ]
    };

    // Enviar e-mail
    await transporter.sendMail(mailOptions);

    // Remover arquivo temporário após envio
    fs.unlinkSync(curriculo.path);

    res.json({
      success: true,
      message: `Obrigado! Seu currículo foi enviado com sucesso. ID: #${candidatoId}`
    });

  } catch (error) {
    console.error('Erro ao enviar candidatura:', error);
    
    // Remover arquivo se houver erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Ocorreu um erro ao enviar seu currículo. Por favor, tente novamente mais tarde.'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📧 Lembre-se de configurar as credenciais de e-mail no código!');
  console.log('🗄️ Banco de dados SQLite configurado e pronto!');
  console.log(`👥 Painel administrativo: http://localhost:${PORT}/admin/candidatos`);
});

// Fechar banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
  console.log('\n🔄 Encerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('✅ Banco de dados fechado.');
    }
    process.exit(0);
  });
});

// Tratamento de erros do multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. O tamanho máximo permitido é 5MB.'
      });
    }
  }
  
  if (error.message.includes('Tipo de arquivo não permitido')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.'
  });
});