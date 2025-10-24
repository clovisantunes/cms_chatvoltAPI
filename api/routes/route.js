import express from 'express';
import examesController from '../controllers/examesController.js';

const router = express.Router();

// Rotas existentes
router.get('/', examesController.getAllExames);
router.get('/:id', examesController.getExameById);
router.get('/tipo/:tipo', examesController.getExamesByTipo);
router.get('/search/:query', examesController.searchServicos);

// NOVA ROTA DE BUSCA INTELIGENTE
router.get('/busca/:query', examesController.buscaInteligente);

// Rotas de listas
router.get('/lista/categorias', examesController.getCategorias);
router.get('/lista/tipos', examesController.getTipos);

export default router;