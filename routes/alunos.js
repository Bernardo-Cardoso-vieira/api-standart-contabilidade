import { Router } from "express";
import {
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/alunosController.js";
import autenticar from "../middlewares/autenticar.js";
import autorizar from "../middlewares/autorizar.js";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.put("/:id", autenticar, atualizarUsuario);
router.delete("/:id", autenticar, autorizar("ADMIN"), deletarUsuario);

export default router;
