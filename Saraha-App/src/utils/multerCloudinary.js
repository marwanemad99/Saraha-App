import multer from "multer";

export const fileValidation = {
  image: ["image/gif", "image/png", "image/jpeg"],
  pdf: ["application/pdf"],
};

export function fileUpload(customValidation = fileValidation.image) {

  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("In-Valid mimetype format",false);
    }
  }
  const upload = multer({fileFilter, storage });
  return upload;
}
