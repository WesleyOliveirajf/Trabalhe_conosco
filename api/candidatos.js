const { Pool } = require('pg');

// Configuração do banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Autenticação básica
function basicAuth(req) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Basic ')) {
    return false;
  }
  
  const credentials = Buffer.from(auth.slice(6), 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  return username === 'admin' && password === 'senha123';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Verificar autenticação
  if (!basicAuth(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'Acesso negado' });
  }

  try {
    const query = `
      SELECT id, nome, sobrenome, email, telefone, pais, cargo, alertas, curriculo_nome, data_candidatura
      FROM candidatos 
      ORDER BY data_candidatura DESC
    `;
    
    const result = await pool.query(query);
    res.status(200).json(result.rows);
    
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}