const express = require('express');
const router = express.Router();
const examesController = require('../controllers/examesController');

// Rotas principais
router.get('/', examesController.getAllExames);
router.get('/:id', examesController.getExameById);
router.get('/tipo/:tipo', examesController.getExamesByTipo);
router.get('/search/:query', examesController.searchServicos);

// Rotas de listas
router.get('/lista/categorias', examesController.getCategorias);
router.get('/lista/tipos', examesController.getTipos);

module.exports = router;