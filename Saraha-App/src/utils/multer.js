import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import fs, { existsSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileValidation = {
  image: ["image/gif", "image/png", "image/jpeg"],
  pdf: ["application/pdf"],
};

export function fileUpload(customPath="general",customValidation = fileValidation.image) {
  const fullPath = path.join(__dirname, `../uploads/${customPath}`);

  if(!fs.existsSync(fullPath))
  {
    fs.mkdirSync(fullPath,{recursive:true})
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const prefixName= nanoid() + "_" + file.originalname;
        file.dest=`uploads/${customPath}/${prefixName}`
      cb(null,prefixName);
    },
  });

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("In-Valid mimetype format",false);
    }
  }
  const upload = multer({ dest: "uploads", fileFilter, storage });
  return upload;
}
