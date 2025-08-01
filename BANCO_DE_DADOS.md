# 🗄️ Banco de Dados - Sistema RH Torp

## 📋 Visão Geral

O sistema agora possui um banco de dados SQLite interno que armazena automaticamente todos os dados dos candidatos que preenchem o formulário.

## 🎯 Funcionalidades

### ✅ Armazenamento Automático
- **Todos os dados** dos candidatos são salvos automaticamente
- **ID único** gerado para cada candidatura
- **Data/hora** de envio registrada automaticamente
- **Nome do arquivo** do currículo armazenado

### 📊 Painel Administrativo
- **URL:** http://localhost:3000/admin/candidatos
- **Visualização completa** de todos os candidatos
- **Estatísticas** em tempo real
- **Interface responsiva** e moderna

### 🔌 API REST
- **Endpoint:** http://localhost:3000/api/candidatos
- **Formato:** JSON
- **Dados:** Lista completa de candidatos

## 🗃️ Estrutura do Banco

### Tabela: `candidatos`

| Campo | Tipo | Descrição |
|-------|------|----------|
| `id` | INTEGER | ID único (auto-incremento) |
| `nome` | TEXT | Nome do candidato |
| `sobrenome` | TEXT | Sobrenome do candidato |
| `email` | TEXT | E-mail do candidato |
| `telefone` | TEXT | Telefone do candidato |
| `pais` | TEXT | País do candidato |
| `curriculo_nome` | TEXT | Nome do arquivo do currículo |
| `data_envio` | DATETIME | Data/hora do envio (automático) |

## 📁 Arquivo do Banco

- **Localização:** `./candidatos.db`
- **Tipo:** SQLite
- **Criação:** Automática na primeira execução
- **Backup:** Recomendado fazer backup regular do arquivo

## 🚀 Como Usar

### 1. Visualizar Candidatos
```
http://localhost:3000/admin/candidatos
```

### 2. API para Integração
```javascript
// Buscar todos os candidatos
fetch('/api/candidatos')
  .then(response => response.json())
  .then(data => {
    console.log('Total:', data.total);
    console.log('Candidatos:', data.candidatos);
  });
```

### 3. Consulta SQL Direta
```sql
-- Buscar todos os candidatos
SELECT * FROM candidatos ORDER BY data_envio DESC;

-- Candidatos por país
SELECT pais, COUNT(*) as total 
FROM candidatos 
GROUP BY pais 
ORDER BY total DESC;

-- Candidatos de hoje
SELECT * FROM candidatos 
WHERE DATE(data_envio) = DATE('now');
```

## 🔧 Manutenção

### Backup do Banco
```bash
# Copiar arquivo do banco
cp candidatos.db backup_candidatos_$(date +%Y%m%d).db
```

### Consultar Banco Diretamente
```bash
# Instalar SQLite (se necessário)
npm install -g sqlite3

# Abrir banco
sqlite3 candidatos.db

# Comandos úteis
.tables          # Listar tabelas
.schema          # Ver estrutura
.quit            # Sair
```

## 📈 Estatísticas Disponíveis

- **Total de candidatos**
- **Candidatos de hoje**
- **Candidatos por país**
- **Histórico temporal**

## 🔒 Segurança

- ✅ Dados armazenados localmente
- ✅ Sem exposição externa
- ✅ Backup recomendado
- ⚠️ Proteger arquivo `candidatos.db`

## 🆕 Novidades no E-mail

- **ID da candidatura** incluído no assunto
- **Referência única** para cada candidato
- **Confirmação** de salvamento no banco

## 📞 Suporte

### Problemas Comuns

**Erro: "Database locked"**
- Feche todas as conexões
- Reinicie o servidor

**Painel não carrega**
- Verifique se o servidor está rodando
- Acesse: http://localhost:3000/admin/candidatos

**Dados não aparecem**
- Teste enviando uma candidatura
- Verifique se o arquivo `candidatos.db` foi criado

---

**Status:** ✅ Banco de dados ativo e funcionando

**Localização do arquivo:** `./candidatos.db`

**Última atualização:** Sistema implementado com sucesso