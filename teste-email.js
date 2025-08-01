// Script de teste para verificar configuração de e-mail
const nodemailer = require('nodemailer');
require('dotenv').config();

// Mesma configuração do server.js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // E-mail remetente da Torp
    pass: process.env.EMAIL_PASS  // Senha de aplicativo
  }
});

// Função de teste
async function testarEmail() {
  console.log('🧪 Testando configuração de e-mail...');
  
  try {
    // Verificar conexão
    await transporter.verify();
    console.log('✅ Conexão com servidor de e-mail: OK');
    
    // Enviar e-mail de teste
    const info = await transporter.sendMail({
      from: 'dtitorp@gmail.com',
      to: process.env.EMAIL_TO,
      subject: '🧪 Teste - Sistema RH Torp',
      html: `
        <h2>✅ Teste de Configuração</h2>
        <p>Este é um e-mail de teste do sistema RH da Torp.</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p><strong>Status:</strong> Configuração funcionando corretamente!</p>
        <hr>
        <p><em>Se você recebeu este e-mail, o sistema está pronto para receber currículos.</em></p>
      `
    });
    
    console.log('✅ E-mail de teste enviado com sucesso!');
    console.log('📧 ID da mensagem:', info.messageId);
    console.log('🎯 Destinatário: bruno.oliveira@torp.ind.br');
    console.log('');
    console.log('🔍 Verifique a caixa de entrada (e spam) do Bruno.');
    
  } catch (error) {
    console.log('❌ Erro na configuração:');
    console.log('');
    
    console.log('🔴 Erro detalhado:', error.message);
    console.log('');
    
    if (error.code === 'EAUTH') {
      console.log('🔐 Problema de autenticação:');
      console.log('   • Verifique se o e-mail está correto');
      console.log('   • Confirme se está usando senha de aplicativo');
      console.log('   • Verifique se a verificação em 2 etapas está ativa');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🌐 Problema de conexão:');
      console.log('   • Verifique sua conexão com a internet');
      console.log('   • Confirme se não há firewall bloqueando');
    } else {
      console.log('⚠️ Erro desconhecido:');
      console.log('   ', error.message);
    }
    
    console.log('');
    console.log('📖 Consulte o arquivo CONFIGURACAO_EMAIL.md para mais detalhes.');
  }
}

// Executar teste
testarEmail();

console.log('='.repeat(60));
console.log('🧪 TESTE DE CONFIGURAÇÃO DE E-MAIL - TORP RH');
console.log('='.repeat(60));
console.log('');
console.log('📝 Instruções:');
console.log('1. Configure as credenciais reais no server.js');
console.log('2. Execute: node teste-email.js');
console.log('3. Verifique se o e-mail chegou no Bruno');
console.log('');
console.log('⚙️ Iniciando teste...');
console.log('');