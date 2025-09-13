import { Router } from "express";
import * as heroCtrl from "./hero.controller.js";
import { validateBody } from "../../middleware/validate.js";

const router = Router();

router.get("/", heroCtrl.list);
router.get("/:id", heroCtrl.getById);
router.post("/", validateBody(["nickname"]), heroCtrl.create);
router.put("/:id", validateBody(["nickname"]), heroCtrl.update);
router.delete("/:id", heroCtrl.remove);

export default router;
