import prisma from "./client.js";
import { hashSenha } from "../utils/senha.js";

// upsert: o seed pode rodar várias vezes sem quebrar no email @unique
async function main() {
  const maria = await prisma.usuario.upsert({
    where: { email: "usuario@email.com" },
    update: {},
    create: {
      nome: "João Usuário",
      email: "usuario@email.com",
      senhaHash: await hashSenha("senha123"), // USER — senha de teste: senha123
      cidade: "Belo Horizonte",
      frase: "Sempre aprendendo.",
      planosFuturos: "Conhecer novas tecnologias",
    },
  });
  console.log("Usuário criado:", maria.nome);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@biblioteca.com" },
    update: {},
    create: {
      nome: "Admin Biblioteca",
      email: "admin@biblioteca.com",
      senhaHash: await hashSenha("admin123"), // ADMIN — senha de teste: admin123
      cidade: "Belo Horizonte",
      role: "ADMIN",
    },
  });
  console.log("Admin criado:", admin.nome);

  const joao = await prisma.usuario.upsert({
    where: { email: "maria@biblioteca.com" },
    update: {},
    create: {
      nome: "Maria Leitora",
      email: "maria@biblioteca.com",
      senhaHash: await hashSenha("joao123"),
      cidade: "Belo Horizonte",
      frase: "Uma boa história sempre fica.",
      planosFuturos: "Ler mais clássicos",
    },
  });
  console.log("Usuário criado:", joao.nome);

  console.log("Usuários de desenvolvimento:");
  console.log("Usuário: usuario@email.com / senha123");
  console.log("Usuária: maria@biblioteca.com / joao123");
  console.log("Admin: admin@biblioteca.com / admin123");

  const mensagens = [
    {
      texto: "Bem-vindo à biblioteca! Vamos compartilhar boas leituras.",
      autorId: maria.id,
    },
    {
      texto: "Uma mensagem para lembrar do livro que mudou sua perspectiva.",
      autorId: joao.id,
    },
    {
      texto: "A biblioteca está recebendo novas recomendações.",
      autorId: maria.id,
    },
  ];

  for (const dados of mensagens) {
    const jaTemMensagem = await prisma.mensagem.findFirst({
      where: dados,
    });

    if (!jaTemMensagem) {
      const mensagem = await prisma.mensagem.create({ data: dados });
      console.log("Mensagem criada:", mensagem.texto);
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
