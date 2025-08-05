# 🐘 Acessando o Banco de Dados PostgreSQL

Este documento descreve como acessar o banco de dados PostgreSQL configurado para este projeto usando as ferramentas **pgAdmin** (que geralmente é instalado com o PostgreSQL) ou **DBeaver** (uma ferramenta de banco de dados universal).

## 🔑 Credenciais de Acesso

As informações a seguir são necessárias para configurar a conexão em qualquer uma das ferramentas:

- **Host**: `localhost`
- **Porta**: `5432`
- **Usuário**: `postgres`
- **Senha**: `admin`
- **Banco de Dados**: `candidatos_db`

---

## 🐘 Usando o pgAdmin 4

O pgAdmin é a plataforma de gerenciamento e desenvolvimento de código aberto mais popular para PostgreSQL.

1.  **Abra o pgAdmin 4**: Você pode encontrá-lo no menu Iniciar.
2.  **Adicionar um Novo Servidor**:
    *   Clique com o botão direito em `Servers` no painel do navegador à esquerda e selecione `Register` > `Server...`.
    *   Na aba `General`, dê um nome para o seu servidor (por exemplo, `Projeto RH Torp`).
    *   Vá para a aba `Connection`.
3.  **Configurar a Conexão**:
    *   **Host name/address**: `localhost`
    *   **Port**: `5432`
    *   **Maintenance database**: `postgres` (ou `candidatos_db`)
    *   **Username**: `postgres`
    *   **Password**: `admin`
    *   Marque a opção `Save password?` para não precisar digitá-la toda vez.
4.  **Salvar**: Clique no botão `Save`.

Agora você verá seu servidor listado no painel esquerdo. Você pode expandi-lo para ver os bancos de dados, incluindo `candidatos_db`, e navegar por suas tabelas (como a tabela `candidatos`).

---

## 🐘 Usando o DBeaver

DBeaver é um cliente de banco de dados universal que suporta muitos sistemas de banco de dados, incluindo o PostgreSQL.

1.  **Abra o DBeaver**.
2.  **Criar uma Nova Conexão**:
    *   Vá para `Database` > `New Database Connection` no menu superior (ou clique no ícone de tomada com um `+`).
    *   Selecione `PostgreSQL` na lista e clique em `Next`.
3.  **Configurar as Credenciais do Servidor**:
    *   **Host**: `localhost`
    *   **Port**: `5432`
    *   **Database**: `candidatos_db`
    *   **Username**: `postgres`
    *   **Password**: `admin`
    *   Você pode marcar `Save password locally`.
4.  **Testar a Conexão (Opcional, mas recomendado)**:
    *   Clique em `Test Connection ...` na parte inferior da janela. Se tudo estiver correto, você verá uma mensagem de sucesso.
5.  **Finalizar**: Clique em `Finish`.

A nova conexão aparecerá no painel `Database Navigator`. Você pode expandi-la para explorar o banco de dados `candidatos_db` e suas tabelas.