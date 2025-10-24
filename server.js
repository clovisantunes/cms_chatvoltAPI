import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import examesRoutes from './routes/exames.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/exames', examesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API de exames: http://localhost:${PORT}/api/exames`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default app;