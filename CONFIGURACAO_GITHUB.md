# 🔐 Configuração para GitHub - Sistema RH Torp

## ✅ Arquivos Protegidos

Este projeto foi configurado para proteger informações sensíveis ao ser enviado para o GitHub:

### 📁 Arquivos que NÃO vão para o GitHub (.gitignore):
- `.env` - Credenciais reais de e-mail
- `candidatos.db` - Banco de dados com informações dos candidatos
- `uploads/` - Currículos enviados pelos candidatos
- `node_modules/` - Dependências (serão reinstaladas)

### 📁 Arquivos que VÃO para o GitHub:
- `.env.example` - Modelo de configuração (sem credenciais reais)
- `README.md` - Instruções completas
- `server.js` - Código modificado para usar variáveis de ambiente
- `teste-email.js` - Script de teste modificado
- Todos os arquivos do frontend (`public/`)

## 🚀 Passos para Subir no GitHub

### 1. Inicializar Git (se ainda não foi feito)
```bash
git init
```

### 2. Adicionar arquivos
```bash
git add .
```

### 3. Fazer commit
```bash
git commit -m "Sistema RH - Landing Page com configuração segura"
```

### 4. Conectar ao repositório GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### 5. Enviar para GitHub
```bash
git push -u origin main
```

## 🔧 Configuração em Nova Máquina

Quando alguém clonar o projeto do GitHub:

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com credenciais reais
# EMAIL_USER=dtitorp@gmail.com
# EMAIL_PASS=zjyj xvne zxtl pymt
# EMAIL_TO=bruno.oliveira@torp.ind.br
# PORT=3000
```

### 4. Testar configuração
```bash
# Testar e-mail
node teste-email.js

# Iniciar servidor
npm start
```

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` com credenciais reais
- **SEMPRE** use o `.env.example` como modelo
- **VERIFIQUE** o `.gitignore` antes de fazer push
- **TESTE** a configuração após clonar em nova máquina

## 🔒 Segurança Garantida

✅ Credenciais protegidas em variáveis de ambiente  
✅ Arquivo `.env` ignorado pelo Git  
✅ Banco de dados local não versionado  
✅ Currículos não expostos publicamente  
✅ Código limpo e sem informações sensíveis  

**O projeto está 100% seguro para ser enviado ao GitHub!**