import examesService from '../services/examesService.js';

class ExamesController {
  // GET /api/exames - Todos os exames
  async getAllExames(req, res) {
    try {
      const exames = await examesService.getAllExames();
      
      res.json({
        success: true,
        count: exames.length,
        data: exames
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/exames/:id - Exame por ID
  async getExameById(req, res) {
    try {
      const { id } = req.params;
      const exame = await examesService.getExameById(id);
      
      if (!exame) {
        return res.status(404).json({
          success: false,
          error: 'Exame não encontrado'
        });
      }

      res.json({
        success: true,
        data: exame
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/exames/tipo/:tipo - Exames por tipo
  async getExamesByTipo(req, res) {
    try {
      const { tipo } = req.params;
      const exames = await examesService.getExamesByTipo(tipo);
      
      res.json({
        success: true,
        count: exames.length,
        data: exames
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/exames/search/:query - Buscar serviços
  async searchServicos(req, res) {
    try {
      const { query } = req.params;
      
      if (!query || query.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Query deve ter pelo menos 3 caracteres'
        });
      }

      const resultados = await examesService.searchServicos(query);
      
      res.json({
        success: true,
        query,
        count: resultados.length,
        data: resultados
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/exames/lista/categorias - Todas as categorias
  async getCategorias(req, res) {
    try {
      const categorias = await examesService.getCategorias();
      
      res.json({
        success: true,
        count: categorias.length,
        data: categorias
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/exames/lista/tipos - Todos os tipos
  async getTipos(req, res) {
    try {
      const tipos = await examesService.getTipos();
      
      res.json({
        success: true,
        count: tipos.length,
        data: tipos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new ExamesController();