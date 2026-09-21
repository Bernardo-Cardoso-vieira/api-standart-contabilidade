import prisma from "../prisma/client.js";
import { hashSenha, verificarSenha } from "../utils/senha.js";
import { gerarToken } from "../utils/jwt.js";

const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
};

// POST /auth/register
export async function register(req, res, next) {
  try {
    const { nome, email, senha, cidade, frase, planosFuturos } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "nome, email e senha são obrigatórios" });
    }

    const senhaHash = await hashSenha(senha);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, cidade, frase, planosFuturos },
      select: selectSemSenha,
    });

    res.status(201).json(usuario);
  } catch (erro) {
    if (erro.code === "P2002") {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }
    next(erro);
  }
}

// POST /auth/login
export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    // busca o usuário COM senhaHash (único lugar que precisa dele)
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaConfere = await verificarSenha(senha, usuario.senhaHash);
    if (!senhaConfere) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = gerarToken(usuario);
    res.json({ token });
  } catch (erro) {
    next(erro);
  }
}
