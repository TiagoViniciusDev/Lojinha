import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Carrega as credenciais da conta de serviço
const serviceAccount = JSON.parse(
  await readFile(
    new URL('./serviceAccountKey.json', import.meta.url)
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'payments-links-55688.appspot.com', // Seu bucket do Firebase Storage
});

const bucket = admin.storage().bucket();

export { admin, bucket };



