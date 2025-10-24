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
    const queryLower = query.toLowerCase().trim();
    
    // SEPARA A QUERY EM PALAVRAS E REMOVE PALAVRAS COMUNS
    const palavras = queryLower.split(' ')
      .filter(palavra => 
        !['de', 'da', 'do', 'com', 'para', 'por', 'em', 'no', 'na'].includes(palavra)
      );
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const { tipo, categorias } = data;
      
      categorias?.forEach(categoria => {
        categoria.exames?.forEach(exame => {
          const { servico, valor } = exame;
          
          // NORMALIZA O SERVIÇO PARA BUSCA
          const servicoLower = servico.toLowerCase();
          const servicoSemAcentos = servicoLower
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          
          // VERIFICA CORRESPONDÊNCIAS
          let score = 0;
          
          // Busca por palavra-chave principal
          if (queryLower.includes('ginec') && servicoLower.includes('ginec')) {
            score += 10;
          }
          if (queryLower.includes('cardio') && servicoLower.includes('cardio')) {
            score += 10;
          }
          if (queryLower.includes('eco') && servicoLower.includes('eco')) {
            score += 10;
          }
          if (queryLower.includes('abdomen') && servicoLower.includes('abdomen')) {
            score += 10;
          }
          if (queryLower.includes('ultrassom') && servicoLower.includes('ultrassom')) {
            score += 10;
          }
          
          // Busca por palavras individuais
          palavras.forEach(palavra => {
            if (servicoLower.includes(palavra)) score += 5;
            if (servicoSemAcentos.includes(palavra)) score += 3;
            if (categoria.categoria.toLowerCase().includes(palavra)) score += 2;
            if (tipo.toLowerCase().includes(palavra)) score += 1;
          });
          
          // Busca por sinônimos
          if (queryLower.includes('usg') && servicoLower.includes('ecografia')) score += 8;
          if (queryLower.includes('ultrassom') && servicoLower.includes('ecografia')) score += 8;
          if (queryLower.includes('consulta') && servicoLower.includes('consulta')) score += 5;
          
          // SE TEM SCORE SUFICIENTE, ADICIONA
          if (score >= 3) {
            resultados.push({
              id: doc.id,
              tipo,
              categoria: categoria.categoria,
              servico,
              valor,
              score: score
            });
          }
        });
      });
    });

    // ORDENA POR SCORE (mais relevantes primeiro)
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