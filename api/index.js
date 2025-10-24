import express from 'express';
import cors from 'cors';
import examesRoutes from './routes/route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/exames', examesRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API está funcionando corretamente 🚀',
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

// Exporta como Serverless handler (necessário na Vercel)
export default app;
