process.loadEnvFile();
const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para CADASTRAR um novo usuário
app.post('/cadastrar', async (req, res) => {
  // Pega os dados que vieram no corpo da requisição
  const { name, email } = req.body;

  // Validação básica
  if (!name || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  try {
    // A query de inserção. 
    // Os símbolos '?' são placeholders que protegem contra SQL Injection
    const comandoSql = 'INSERT INTO test (name, email) VALUES (?, ?)';
    
    // Executa a query passando os valores no array [nome, email]
    const [resultado] = await db.query(comandoSql, [name, email]);

    // O status 201 significa "Created" (Criado)
    res.status(201).json({ 
      mensagem: 'FOI ESSA BUCETA!',
      id: resultado.insertId, // Retorna o ID gerado automaticamente pelo MySQL
      name, 
      email 
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao salvar no banco de dados' });
  }
});

// Rota para BUSCAR todos os usuários cadastrados
app.get('/usuarios', async (req, res) => {
  try {
    const comandoSql = 'SELECT * FROM test';
    const [usuarios] = await db.query(comandoSql);
    
    // Envia a lista de usuários para o front-end
    res.json(usuarios);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar no banco de dados' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
