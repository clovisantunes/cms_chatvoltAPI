import express from 'express';
import examesController from '../controllers/examesController.js';

const router = express.Router();

// Rotas principais
router.get('/', examesController.getAllExames);
router.get('/:id', examesController.getExameById);
router.get('/tipo/:tipo', examesController.getExamesByTipo);
router.get('/search/:query', examesController.searchServicos);

// Rotas de listas
router.get('/lista/categorias', examesController.getCategorias);
router.get('/lista/tipos', examesController.getTipos);

export default router;