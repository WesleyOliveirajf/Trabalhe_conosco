# 📧 Configuração de E-mail - Sistema RH Torp

## 🎯 Objetivo
Configurar o envio automático de currículos para bruno.oliveira@torp.ind.br

## ⚙️ Configuração Atual

### E-mail de Destino
✅ **Já configurado:** bruno.oliveira@torp.ind.br

### E-mail Remetente
🔧 **Precisa configurar:** dtitorp@gmail.com

## 📋 Passo a Passo Completo

### 1. Criar E-mail Gmail para a Empresa

1. Acesse [gmail.com](https://gmail.com)
2. Clique em "Criar conta" → "Para uso comercial"
3. Crie o e-mail: **dtitorp@gmail.com** (ou similar)
4. Complete o cadastro

### 2. Configurar Segurança

1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em **Segurança**
3. Ative **Verificação em duas etapas**
4. Configure com seu telefone

### 3. Gerar Senha de Aplicativo

1. Ainda em **Segurança**, procure **Senhas de app**
2. Clique em **Senhas de app**
3. Selecione **Mail** como aplicativo
4. Clique em **Gerar**
5. **COPIE** a senha gerada (16 caracteres)

### 4. Atualizar o Código

No arquivo `server.js`, linha 56, substitua:

```javascript
auth: {
  user: 'dtitorp@gmail.com', // E-mail real criado
  pass: 'abcd efgh ijkl mnop' // Senha de app copiada (sem espaços)
}
```

### 5. Testar o Sistema

1. Reinicie o servidor:
   ```bash
   # Pressione Ctrl+C no terminal
   npm start
   ```

2. Acesse http://localhost:3000
3. Preencha o formulário com dados de teste
4. Envie um currículo
5. Verifique se chegou em bruno.oliveira@torp.ind.br

## 🔒 Segurança

- ✅ Use sempre senhas de aplicativo
- ✅ Nunca compartilhe as credenciais
- ✅ Mantenha a verificação em 2 etapas ativa

## 🚨 Solução de Problemas

### Erro: "Invalid login"
- Verifique se a verificação em 2 etapas está ativa
- Confirme se está usando senha de app, não a senha normal
- Verifique se o e-mail está correto

### Erro: "Less secure app access"
- Use senhas de aplicativo em vez de "acesso a apps menos seguros"

### E-mail não chega
- Verifique a pasta de spam
- Confirme o e-mail de destino
- Teste com outro e-mail primeiro

## 📞 Suporte

Se precisar de ajuda, verifique:
1. As credenciais estão corretas no código
2. O servidor foi reiniciado após as mudanças
3. A internet está funcionando
4. O Gmail não está bloqueando o acesso

---

**Status Atual:** ⚠️ Aguardando configuração das credenciais reais

**Próximo Passo:** Criar o e-mail Gmail e gerar a senha de aplicativo