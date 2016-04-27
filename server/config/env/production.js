import path from 'path';

export default {
  logging: true,
  port: 80,
  appUrl: process.env.APP_URL,
  sendErrors: true,
  uploadDest: process.env.UPLOAD_DEST || path.join(process.cwd(), 'uploads'),
  db: {
    seed: false,
    url: process.env.MONGO_URL
  }
};
