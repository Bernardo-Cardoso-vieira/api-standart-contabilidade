import { verificarToken } from "../utils/jwt.js";
import prisma from "../prisma/client.js";

export default async function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = header.split(" ")[1];

  let payload;
  try {
    payload = verificarToken(token);
  } catch (erro) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }

  try {
    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true },
    });

    if (!usuarioEncontrado) {
      return res.status(401).json({ erro: "Token inválido ou expirado" });
    }

    req.usuario = usuarioEncontrado;
    next();
  } catch (erro) {
    next(erro);
  }
}
