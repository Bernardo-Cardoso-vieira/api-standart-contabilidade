import prisma from "../prisma/client.js";
import { hashSenha, verificarSenha } from "../utils/senha.js";
import { gerarToken } from "../utils/jwt.js";

const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  usuario: true,
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
    const { nome, email, usuario: nomeUsuario, senha, cidade, frase, planosFuturos } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "nome, email e senha são obrigatórios" });
    }

    const senhaHash = await hashSenha(senha);

    const usuarioCriado = await prisma.usuario.create({
      data: { nome, email, usuario: nomeUsuario, senhaHash, cidade, frase, planosFuturos },
      select: selectSemSenha,
    });

    res.status(201).json(usuarioCriado);
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
    const { email, usuario, senha } = req.body;

    if ((!email && !usuario) || !senha) {
      return res.status(400).json({ erro: "usuario ou email e senha são obrigatórios" });
    }

    // busca o usuário COM senhaHash (único lugar que precisa dele)
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: email ? { email } : { usuario },
    });

    if (!usuarioEncontrado) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaConfere = await verificarSenha(senha, usuarioEncontrado.senhaHash);
    if (!senhaConfere) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = gerarToken(usuarioEncontrado);
    res.json({ token });
  } catch (erro) {
    next(erro);
  }
}
