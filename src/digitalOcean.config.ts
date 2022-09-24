const { S3 } = require('@aws-sdk/client-s3')
require('dotenv').config()

const s3Client = new S3({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
  }
})

module.exports = s3Client
