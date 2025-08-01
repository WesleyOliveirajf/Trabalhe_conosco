# Página de Candidatura - Trabalhe Conosco

Uma aplicação web completa para recebimento de candidaturas de emprego com envio automático por e-mail.

## 🚀 Funcionalidades

- ✅ Formulário completo de candidatura
- ✅ Validação em tempo real dos campos
- ✅ Máscara automática para telefone brasileiro
- ✅ Upload de currículo com validação de tipo e tamanho
- ✅ Envio automático por e-mail
- ✅ Interface responsiva e moderna
- ✅ Feedback visual para o usuário
- ✅ Banco de dados SQLite integrado
- ✅ Painel administrativo para visualizar candidatos
- ✅ API REST para consulta de dados
- ✅ ID único para cada candidatura

## 📋 Campos do Formulário

- **Nome** (obrigatório)
- **Sobrenome** (obrigatório)
- **E-mail** (obrigatório, com validação)
- **Telefone** (obrigatório, formato brasileiro)
- **País** (obrigatório, dropdown com opções)
- **Currículo** (obrigatório, .DOC/.DOCX/.PDF/.TXT, máx. 5MB)

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express
- **Upload:** Multer
- **E-mail:** Nodemailer
- **Estilo:** CSS Grid/Flexbox, Gradientes, Animações

## 📦 Instalação

1. **Clone ou baixe o projeto**

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## ⚙️ Configuração

### 🔐 Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env` com suas credenciais:**
   ```env
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=sua-senha-de-aplicativo-16-caracteres
   EMAIL_TO=destinatario@empresa.com
   PORT=3000
   ```

### 📧 Configuração de E-mail (OBRIGATÓRIA)

**Status:** ✅ Configurado com variáveis de ambiente

**E-mail de destino:** bruno.oliveira@torp.ind.br ✅

**E-mail remetente:** Precisa ser configurado 🔧

#### Passo a Passo Rápido:

1. **Consulte o arquivo:** `CONFIGURACAO_EMAIL.md` (instruções completas)
2. **Crie um Gmail:** rh.torp.sistema@gmail.com (ou similar)
3. **Configure:** Verificação em 2 etapas + Senha de aplicativo
4. **Atualize:** Credenciais no `server.js`
5. **Teste:** Execute `node teste-email.js`

#### Configuração no Código:

```javascript
// Em server.js, linhas 54-58:
auth: {
  user: 'rh.torp.sistema@gmail.com', // E-mail real da empresa
  pass: 'abcd efgh ijkl mnop' // Senha de aplicativo (16 caracteres)
}
```

## 🚀 Execução

### Modo de Desenvolvimento
```bash
npm run dev
```

### Modo de Produção
```bash
npm start
```

O servidor será iniciado em: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
trabalhe-conosco/
├── package.json              # Dependências do projeto
├── server.js                # Servidor Express
├── README.md               # Documentação principal
├── CONFIGURACAO_EMAIL.md   # 📧 Guia de configuração de e-mail
├── BANCO_DE_DADOS.md       # 🗄️ Documentação do banco de dados
├── teste-email.js          # 🧪 Script de teste de e-mail
├── candidatos.db           # 🗄️ Banco de dados SQLite (criado automaticamente)
└── public/
    ├── index.html          # Página principal
    ├── styles.css          # Estilos CSS
    └── script.js           # JavaScript do frontend
```

## 🔧 Configurações Importantes

### Validações Implementadas

- **Nome/Sobrenome:** Mínimo 2 caracteres
- **E-mail:** Formato válido de e-mail
- **Telefone:** Formato brasileiro (XX) XXXXX-XXXX
- **País:** Seleção obrigatória
- **Currículo:** Tipos .DOC, .DOCX, .PDF, .TXT | Máximo 5MB

### Segurança

- Validação de tipos de arquivo
- Limitação de tamanho de upload
- Sanitização de dados de entrada
- Remoção automática de arquivos temporários

## 📧 Formato do E-mail Enviado

**Assunto:** Nova Candidatura: [Nome] [Sobrenome] - [País]

**Corpo:**
```
Nova Candidatura Recebida

Nome: [Nome do Candidato]
Sobrenome: [Sobrenome do Candidato]
E-mail: [E-mail do Candidato]
Telefone: [Telefone do Candidato]
País: [País do Candidato]

O currículo do candidato está anexado a este e-mail.
```

## 🎨 Características da Interface

- Design moderno com gradientes
- Responsivo para mobile e desktop
- Animações suaves
- Feedback visual em tempo real
- Estados de loading durante envio
- Mensagens de sucesso e erro

## 🔍 Solução de Problemas

### Erro de E-mail
- Verifique as credenciais no `server.js`
- Para Gmail, use senha de app, não a senha normal
- Verifique se a verificação em 2 etapas está ativa

### Erro de Upload
- Verifique se o arquivo está dentro do limite de 5MB
- Confirme se o tipo de arquivo é permitido
- Verifique as permissões da pasta `uploads`

### Erro de Conexão
- Verifique se o servidor está rodando na porta 3000
- Confirme se não há conflitos de porta

## 📝 Personalização

### Adicionar Novos Países
Edite o arquivo `public/index.html` e adicione novas opções no select:

```html
<option value="Novo País">Novo País</option>
```

### Alterar Tipos de Arquivo Permitidos
Edite o arquivo `server.js` na função `fileFilter`:

```javascript
const allowedTypes = ['.doc', '.docx', '.pdf', '.txt', '.rtf'];
```

### Modificar Limite de Tamanho
Edite o arquivo `server.js` na configuração do multer:

```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido para facilitar o processo de recrutamento e seleção.**