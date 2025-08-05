# Configuração do PostgreSQL

## Pré-requisitos

Antes de executar a aplicação, você precisa ter o PostgreSQL instalado e configurado.

### 1. Instalação do PostgreSQL

- **Windows**: Baixe e instale do site oficial: https://www.postgresql.org/download/windows/
- **macOS**: Use Homebrew: `brew install postgresql`
- **Linux**: Use o gerenciador de pacotes: `sudo apt-get install postgresql postgresql-contrib`

### 2. Configuração do Banco de Dados

1. **Acesse o PostgreSQL como superusuário:**
   ```bash
   psql -U postgres
   ```

2. **Crie o banco de dados:**
   ```sql
   CREATE DATABASE candidatos_db;
   ```

3. **Defina a senha do usuário postgres (se necessário):**
   ```sql
   ALTER USER postgres PASSWORD 'admin';
   ```

4. **Saia do PostgreSQL:**
   ```sql
   \q
   ```

### 3. Configuração das Variáveis de Ambiente

Verifique se o arquivo `.env` contém as configurações corretas:

```env
# Configurações do PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=candidatos_db
DB_USER=postgres
DB_PASS=admin

# Configurações de Autenticação Admin
ADMIN_USER=admin
ADMIN_PASS=admin
```

### 4. Iniciar a Aplicação

Após configurar o PostgreSQL, execute:

```bash
npm start
```

### 5. Acesso ao Painel Administrativo

- **URL**: http://localhost:3000/admin/candidatos
- **Login**: admin
- **Senha**: admin

## Migração de Dados do SQLite (Opcional)

Se você tinha dados no SQLite anterior, pode exportá-los e importá-los no PostgreSQL:

1. **Exporte os dados do SQLite para CSV**
2. **Importe no PostgreSQL usando COPY ou ferramentas gráficas**

## Troubleshooting

- **Erro de conexão**: Verifique se o PostgreSQL está rodando
- **Erro de autenticação**: Confirme usuário e senha no `.env`
- **Banco não encontrado**: Certifique-se de que criou o banco `candidatos_db`