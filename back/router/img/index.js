import { Router } from "express";
import { upload } from "../../multer/imgUploader.js";
const router = Router();

//upload.single("img")로 받겠다.
router.post("/", upload.single("img"), (req, res) => {
  console.log("server /write");

  //파일이 있으면 실행
  if (req.file?.filename) {
    res.json({ fileName: req.file.filename });
  } else {
    res.json({ fileName: null });
  }
});

export default router;
