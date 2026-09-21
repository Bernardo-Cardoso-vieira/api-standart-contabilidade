import prisma from "../prisma/client.js";

export async function listarServicos(req, res, next) {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { criadoEm: "desc" },
      include: { autor: { select: { nome: true } } },
    });
    res.json(servicos);
  } catch (erro) {
    next(erro);
  }
}

export async function criarServico(req, res, next) {
  try {
    const { titulo, descricao, imagemUrl } = req.body;
    if (!titulo || !descricao) {
      return res.status(400).json({ erro: "titulo e descricao são obrigatórios" });
    }

    const servico = await prisma.servico.create({
      data: { titulo, descricao, imagemUrl, autorId: req.usuario.id },
    });
    res.status(201).json(servico);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarServico(req, res, next) {
  try {
    const { titulo, descricao, imagemUrl } = req.body;
    const servico = await prisma.servico.update({
      where: { id: Number(req.params.id) },
      data: { titulo, descricao, imagemUrl },
    });
    res.json(servico);
  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }
    next(erro);
  }
}

export async function deletarServico(req, res, next) {
  try {
    await prisma.servico.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }
    next(erro);
  }
}
