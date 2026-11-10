import multer from "multer";
import { detectImageType } from "../services/validation/imageTools.js";

export const MAX_IMAGES = 5;

// Hanya gambar. Tipe asli diverifikasi ulang lewat magic bytes di verifyImageFiles.
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  const error = new Error(`Format file tidak didukung: ${file.mimetype}. Hanya JPG, PNG, atau WebP.`);
  error.statusCode = 400;
  return cb(error);
};

const createImageUploader = () =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: MAX_IMAGES,
    },
  }).array("images", MAX_IMAGES);

export const uploadReportImages = createImageUploader();
export const uploadProgressImages = createImageUploader();

/**
 * Pasang setelah multer. Memastikan isi file benar-benar gambar (bukan file lain yang
 * mimetype-nya dipalsukan) dan menyetel mimetype sesuai isi file.
 */
export const verifyImageFiles = (req, res, next) => {
  for (const file of req.files ?? []) {
    const real = detectImageType(file.buffer);
    if (!real) {
      return res.status(400).json({
        success: false,
        message: `File "${file.originalname}" bukan gambar JPG, PNG, atau WebP yang valid`,
      });
    }
    file.mimetype = real;
  }
  next();
};
