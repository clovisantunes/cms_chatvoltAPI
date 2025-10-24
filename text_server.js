const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check simples
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Rota simples de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test está funcionando!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor teste rodando na porta ${PORT}`);
});