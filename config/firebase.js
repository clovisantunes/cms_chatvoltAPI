const admin = require('firebase-admin');

let db;

try {
  let serviceAccount;
  
  // Verifica se está no ambiente Vercel (produção)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Usa variáveis de ambiente na Vercel
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    };
  } else {
    // Usa arquivo local apenas em desenvolvimento
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (error) {
      console.log('⚠️  Arquivo serviceAccountKey.json não encontrado, usando variáveis de ambiente...');
      serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      };
    }
  }

  // Verifica se as credenciais mínimas existem
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error('Credenciais do Firebase não encontradas');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
  }
  
  db = admin.firestore();
  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
  db = null;
}

module.exports = db;