import { Router } from "express";
import {
  listarServicos,
  criarServico,
  atualizarServico,
  deletarServico,
} from "../controllers/servicosController.js";
import autenticar from "../middlewares/autenticar.js";
import autorizar from "../middlewares/autorizar.js";

const router = Router();

router.get("/", listarServicos);
router.post("/", autenticar, autorizar("ADMIN"), criarServico);
router.put("/:id", autenticar, autorizar("ADMIN"), atualizarServico);
router.delete("/:id", autenticar, autorizar("ADMIN"), deletarServico);

export default router;
