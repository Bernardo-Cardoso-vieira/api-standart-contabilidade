import prisma from "../prisma/client.js";

export async function listarFuncionarios(req, res, next) {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(funcionarios);
  } catch (erro) {
    next(erro);
  }
}

export async function criarFuncionario(req, res, next) {
  try {
    const { nome, cargo, email, telefone, fotoUrl } = req.body;
    if (!nome || !cargo) {
      return res.status(400).json({ erro: "nome e cargo são obrigatórios" });
    }

    const funcionario = await prisma.funcionario.create({
      data: { nome, cargo, email, telefone, fotoUrl },
    });
    res.status(201).json(funcionario);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarFuncionario(req, res, next) {
  try {
    const { nome, cargo, email, telefone, fotoUrl } = req.body;
    const funcionario = await prisma.funcionario.update({
      where: { id: Number(req.params.id) },
      data: { nome, cargo, email, telefone, fotoUrl },
    });
    res.json(funcionario);
  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }
    next(erro);
  }
}

export async function deletarFuncionario(req, res, next) {
  try {
    await prisma.funcionario.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }
    next(erro);
  }
}
