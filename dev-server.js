const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para parsing de JSON e form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API usando import dinâmico
app.all('/api/submit', async (req, res) => {
  try {
    const { default: submitHandler } = await import('./api/submit.js');
    await submitHandler(req, res);
  } catch (error) {
    console.error('Erro ao carregar API submit:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.all('/api/candidatos', async (req, res) => {
  try {
    const { default: candidatosHandler } = await import('./api/candidatos.js');
    await candidatosHandler(req, res);
  } catch (error) {
    console.error('Erro ao carregar API candidatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para o painel administrativo
app.get('/admin/candidatos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'candidatos.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Página principal: http://localhost:${PORT}`);
  console.log(`👥 Painel administrativo: http://localhost:${PORT}/admin/candidatos`);
  console.log(`📧 Lembre-se de configurar as credenciais de e-mail no .env!`);
});