import prisma from "../prisma/client.js";

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

export async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await prisma.usuario.findMany({ select: selectSemSenha });
    res.json(usuarios);
  } catch (erro) {
    next(erro);
  }
}

export async function buscarUsuario(req, res, next) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
      select: selectSemSenha,
    });
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(usuario);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarUsuario(req, res, next) {
  if (Number(req.params.id) !== req.usuario.id) {
    return res.status(403).json({ erro: "Você só pode editar o próprio usuário" });
  }

  const { nome, email, cidade, frase, planosFuturos, fotoUrl } = req.body;
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: { nome, email, cidade, frase, planosFuturos, fotoUrl },
      select: selectSemSenha,
    });
    res.json(usuario);
  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    next(erro);
  }
}

export async function deletarUsuario(req, res, next) {
  try {
    await prisma.usuario.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    next(erro);
  }
}
