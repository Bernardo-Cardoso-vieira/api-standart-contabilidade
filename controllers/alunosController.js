import prisma from "../prisma/client.js";

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

export async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: selectSemSenha,
    });
    res.json(usuarios);
  } catch (erro) {
    next(erro);
  }
}

export async function buscarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: selectSemSenha,
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarUsuario(req, res, next) {
  const { id } = req.params;

  // só o dono pode editar o próprio perfil
  if (Number(id) !== req.usuario.id) {
    return res
      .status(403)
      .json({ erro: "Você só pode editar o próprio usuário" });
  }

  const dados = req.body;
  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dados,
      select: selectSemSenha,
    });
    res.json(usuarioAtualizado);
  } catch (erro) {
    res.status(404).json({ erro: "Usuário não encontrado" });
  }
}

export async function deletarUsuario(req, res, next) {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (erro) {
    res.status(404).json({ erro: "Usuário não encontrado" });
  }
}
