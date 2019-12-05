const { Storage } = require('@google-cloud/storage')
const fs = require('fs')

module.exports = async ({ file }) => {
    const generated_png = file.destination + '/encoded/' + file.filename;
    const keyFilename = './keyfile.json';
    const bucketName = process.env.GOOGLE_BUCKET_NAME;
    const credentials = JSON.parse(fs.readFileSync(keyFilename, 'utf8'))
    const storage = new Storage({ projectId: credentials.project_id, keyFilename });
    const bucket = storage.bucket(bucketName);
    const filename = `${Date.now()}-${file.originalname}`
    const localReadStream = fs.createReadStream(generated_png);

    await bucket.upload(generated_png, {
        gzip: true,
        metadata: {
            contentType: file.mimetype,
            contentEncoding: file.encoding
        },
    });

    return `https://storage.googleapis.com/${bucketName}/${file.filename}`;
}