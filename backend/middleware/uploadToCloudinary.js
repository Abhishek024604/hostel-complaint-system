/*
Middleware to parse multipart form (using multer memory storage),
then upload files to Cloudinary using cloudinary.v2.uploader.upload_stream.
It sets req.uploaded = { images: [...urls], videos:[...urls] }
*/

const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function uploadBufferToCloudinary(buffer, folder='hostel_complaints') {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(writeStream);
  });
}

const middleware = [
  upload.fields([{ name: 'images' }, { name: 'videos' }]),
  async (req, res, next) => {
    req.uploaded = { images: [], videos: [] };
    try {
      if (req.files?.images) {
        for (const f of req.files.images) {
          const url = await uploadBufferToCloudinary(f.buffer, 'hostel_complaints/images');
          req.uploaded.images.push(url);
        }
      }
      if (req.files?.videos) {
        for (const f of req.files.videos) {
          const url = await uploadBufferToCloudinary(f.buffer, 'hostel_complaints/videos');
          req.uploaded.videos.push(url);
        }
      }
      next();
    } catch (err) {
      console.error('Cloudinary upload error', err);
      next(err);
    }
  }
];

module.exports = middleware;
