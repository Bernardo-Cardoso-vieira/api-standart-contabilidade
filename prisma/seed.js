import prisma from "./client.js";
import { hashSenha } from "../utils/senha.js";

// upsert: o seed pode rodar várias vezes sem quebrar no email @unique
async function main() {
  const usuario = await prisma.usuario.upsert({
    where: { email: "usuario@email.com" },
    update: {},
    create: {
      nome: "Vanderlucio Silva",
      email: "usuario@email.com",
      senhaHash: await hashSenha("silva"),
      cidade: "Belo Horizonte",
      frase: "Sempre aprendendo.",
      planosFuturos: "Conhecer novas tecnologias",
    },
  });
  console.log("Usuário criado:", usuario.nome);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@biblioteca.com" },
    update: {
      nome: "Vanderlucio Silva",
      usuario: "vanderlucio",
      senhaHash: await hashSenha("silva"),
      role: "ADMIN",
    },
    create: {
      nome: "Vanderlucio Silva",
      email: "admin@biblioteca.com",
      usuario: "vanderlucio",
      senhaHash: await hashSenha("silva"),
      cidade: "Belo Horizonte",
      role: "ADMIN",
    },
  });
  console.log("Admin criado:", admin.nome);

  const joao = await prisma.usuario.upsert({
    where: { email: "maria@biblioteca.com" },
    update: {},
    create: {
      nome: "Ana Contadora",
      email: "maria@biblioteca.com",
      senhaHash: await hashSenha("ana123"),
      cidade: "Belo Horizonte",
      frase: "Precisão para cuidar do seu negócio.",
      planosFuturos: "Ajudar empresas a crescer",
    },
  });
  console.log("Usuário criado:", joao.nome);

  console.log("Usuários de desenvolvimento:");
  console.log("Admin: vanderlucio / silva");
  console.log("Funcionária: maria@biblioteca.com / ana123");

  const servicos = [
    {
      titulo: "Contabilidade consultiva",
      descricao: "Decisões financeiras mais claras para a sua empresa.",
      autorId: usuario.id,
    },
    {
      titulo: "Abertura e regularização de empresas",
      descricao: "Cuidamos da burocracia para você começar com segurança.",
      autorId: joao.id,
    },
    {
      titulo: "Folha de pagamento",
      descricao: "Rotinas trabalhistas organizadas e dentro do prazo.",
      autorId: usuario.id,
    },
  ];

  for (const dados of servicos) {
    const jaTemServico = await prisma.servico.findFirst({
      where: dados,
    });

    if (!jaTemServico) {
      const servico = await prisma.servico.create({ data: dados });
      console.log("Serviço criado:", servico.titulo);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
