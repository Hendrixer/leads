process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').load();

const mainconfig = {
  envNames: {
    dev: 'development',
    prod: 'production',
    test: 'testing'
  },
  
  fireRef: process.env.FIRE_REF,
  secrets: {
    adminSecret: process.env.ADMIN_SECRET,
    jwt: process.env.JWT,
    emailTo: process.env.EMAIL_TO,
    gmailUser: process.env.GMAIL_USER,
    gmailPass: process.env.GMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: process.env.AWS_S3_BUCKET
  }
};

mainconfig.env = process.env.NODE_ENV;

export const config = {
  ...mainconfig,
  ...require('./' + mainconfig.env).default || {}
}
