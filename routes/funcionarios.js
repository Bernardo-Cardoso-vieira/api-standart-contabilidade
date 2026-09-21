import { Router } from "express";
import {
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
} from "../controllers/funcionariosController.js";
import autenticar from "../middlewares/autenticar.js";
import autorizar from "../middlewares/autorizar.js";

const router = Router();

router.get("/", listarFuncionarios);
router.post("/", autenticar, autorizar("ADMIN"), criarFuncionario);
router.put("/:id", autenticar, autorizar("ADMIN"), atualizarFuncionario);
router.delete("/:id", autenticar, autorizar("ADMIN"), deletarFuncionario);

export default router;
