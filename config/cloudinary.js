const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const folder = file.fieldname === 'certificate' ? 'certificates' : 'userphotos';
        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png'],
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

module.exports = {
    cloudinary,
    storage,
};
