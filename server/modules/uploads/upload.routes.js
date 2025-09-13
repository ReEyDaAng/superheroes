import { Router } from "express";
import multer from "multer";
import * as uploadCtrl from "./upload.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-image", upload.single("file"), uploadCtrl.uploadImage);
export default router;
