import db from '../config/firebase.js';

class ExamesService {
  async getAllExames() {
    try {
      if (!db) {
        throw new Error('Firebase não configurado');
      }

      const snapshot = await db.collection('exames').get();
      
      if (snapshot.empty) {
        return [];
      }

      const exames = [];
      snapshot.forEach(doc => {
        exames.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return exames;
    } catch (error) {
      console.error('Erro no Firebase:', error);
      throw new Error(`Erro ao buscar exames: ${error.message}`);
    }
  }
async buscaInteligente(query) {
  try {
    if (!db) {
      throw new Error('Firebase não configurado');
    }

    const snapshot = await db.collection('exames').get();
    
    if (snapshot.empty) {
      return [];
    }

    const resultados = [];
    const queryLower = query.toLowerCase();
    
    // SEPARA A QUERY EM PALAVRAS
    const palavras = queryLower.split(' ');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const { tipo, categorias } = data;
      
      categorias?.forEach(categoria => {
        categoria.exames?.forEach(exame => {
          const { servico, valor } = exame;
          
          // VERIFICA CADA PALAVRA DA QUERY
          let matches = 0;
          
          palavras.forEach(palavra => {
            if (tipo?.toLowerCase().includes(palavra)) matches++;
            if (categoria.categoria?.toLowerCase().includes(palavra)) matches++;
            if (servico?.toLowerCase().includes(palavra)) matches++;
            if (valor?.toString().includes(palavra)) matches++;
          });
          
          // SE ENCONTROU PELO MENOS UMA PALAVRA, ADICIONA
          if (matches > 0) {
            resultados.push({
              id: doc.id,
              tipo,
              categoria: categoria.categoria,
              servico,
              valor,
              score: matches // quantas palavras encontrou
            });
          }
        });
      });
    });

    // ORDENA POR SCORE (mais matches primeiro)
    return resultados.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Erro na busca inteligente:', error);
    throw new Error(`Erro ao buscar: ${error.message}`);
  }
}

  async getExameById(id) {
    try {
      if (!db) {
        throw new Error('Firebase não configurado');
      }

      const doc = await db.collection('exames').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Erro ao buscar exame: ${error.message}`);
    }
  }

  // Buscar exames por tipo
  async getExamesByTipo(tipo) {
    try {
      if (!db) {
        throw new Error('Firebase não configurado');
      }

      const snapshot = await db.collection('exames')
        .where('tipo', '==', tipo)
        .get();
      
      if (snapshot.empty) {
        return [];
      }

      const exames = [];
      snapshot.forEach(doc => {
        exames.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return exames;
    } catch (error) {
      throw new Error(`Erro ao buscar exames por tipo: ${error.message}`);
    }
  }

  // Buscar por serviço específico
  async searchServicos(query) {
    try {
      if (!db) {
        throw new Error('Firebase não configurado');
      }

      const snapshot = await db.collection('exames').get();
      
      if (snapshot.empty) {
        return [];
      }

      const resultados = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const categoriasComServicos = [];

        data.categorias?.forEach(categoria => {
          const servicosFiltrados = categoria.exames?.filter(exame =>
            exame.servico.toLowerCase().includes(query.toLowerCase())
          );

          if (servicosFiltrados && servicosFiltrados.length > 0) {
            categoriasComServicos.push({
              categoria: categoria.categoria,
              exames: servicosFiltrados
            });
          }
        });

        if (categoriasComServicos.length > 0) {
          resultados.push({
            id: doc.id,
            tipo: data.tipo,
            categorias: categoriasComServicos
          });
        }
      });

      return resultados;
    } catch (error) {
      throw new Error(`Erro ao buscar serviços: ${error.message}`);
    }
  }

  // Buscar todas as categorias disponíveis
  async getCategorias() {
    try {
      if (!db) {
        throw new Error('Firebase não configurado');
      }

      const snapshot = await db.collection('exames').get();
      
      if (snapshot.empty) {
        return [];
      }

      const categorias = new Set();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        data.categorias?.forEach(cat => {
          if (cat.categoria) {
            categorias.add(cat.categoria);
          }
        });
      });

      return Array.from(categorias);
    } catch (error) {
      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }
  }

  // Buscar todos os tipos disponíveis
  async getTipos() {
    try {
      if (!db) {
        throw new Error('Firebase não configurado');
      }

      const snapshot = await db.collection('exames').get();
      
      if (snapshot.empty) {
        return [];
      }

      const tipos = new Set();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.tipo) {
          tipos.add(data.tipo);
        }
      });

      return Array.from(tipos);
    } catch (error) {
      throw new Error(`Erro ao buscar tipos: ${error.message}`);
    }
  }
}

export default new ExamesService();