const admin = require('firebase-admin');
const path = require('path');

// Carrega o arquivo de service account
const serviceAccount = require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error);
}

const db = admin.firestore();
module.exports = db;