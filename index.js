import "dotenv/config";
import express from "express"; // importa o Express
import cors from "cors"; // novo import
import logger from "./middlewares/logger.js"; // importa o middleware de log
import tratarErro from "./middlewares/erro.js"; // novo import
import usuariosRouter from "./routes/alunos.js"; // importa o router de usuários
import mensagensRouter from "./routes/mensagens.js"; // importa o router de mensagens
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000; // lê do .env, com fallback para 3000

app.use(cors()); // 1º — libera CORS para qualquer origem
app.use(express.json()); // 2º — parseia JSON do body
app.use(logger); // 3º — registra log de cada requisição

// rota raiz — boas-vindas
app.get("/", (req, res) => {
  res.json({ mensagem: "Biblioteca API está no ar!" });
});

// rota de health check
app.get("/status", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// monta as rotas em /auth/register e /auth/login
app.use("/auth", authRouter);

// registra as rotas de usuários com prefixo /usuarios
app.use("/usuarios", usuariosRouter);

// registra as rotas de mensagens com prefixo /mensagens
app.use("/mensagens", mensagensRouter);

// Middleware de erro — SEMPRE por último, depois das rotas
app.use(tratarErro);

// inicia o servidor localmente — na Vercel essa parte é pulada
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// exporta o app para a Vercel usar como serverless function
export default app;
