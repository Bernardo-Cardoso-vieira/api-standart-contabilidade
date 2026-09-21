import prisma from "../prisma/client.js";

export async function listarMensagens(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: "desc" },
      include: {
        autor: {
          select: {
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });
    res.json(mensagens);
  } catch (erro) {
    next(erro);
  }
}

export async function criarMensagem(req, res, next) {
  try {
    const { texto, imagemUrl } = req.body;

    if (!texto) {
      return res.status(400).json({ erro: "O campo texto é obrigatório" });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: req.usuario.id, // autor = quem está logado
      },
    });
    res.status(201).json(novaMensagem);
  } catch (erro) {
    next(erro);
  }
}

export async function deletarMensagem(req, res, next) {
  const { id } = req.params;
  try {
    const mensagem = await prisma.mensagem.findUnique({
      where: { id: Number(id) },
    });

    if (!mensagem) {
      return res.status(404).json({ erro: "Mensagem não encontrada" });
    }

    const ehDono = mensagem.autorId === req.usuario.id;
    const ehAdmin = req.usuario.role === "ADMIN";
    if (!ehDono && !ehAdmin) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para excluir esta mensagem" });
    }

    await prisma.mensagem.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (erro) {
    next(erro);
  }
}
