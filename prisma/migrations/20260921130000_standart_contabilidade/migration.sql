-- Add the administrative username used for login.
ALTER TABLE "Usuario" ADD COLUMN "usuario" TEXT;
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- Rename the original content table into the accounting services catalog.
ALTER TABLE "Mensagem" DROP CONSTRAINT IF EXISTS "Mensagem_autorId_fkey";
ALTER TABLE "Mensagem" RENAME TO "Servico";
ALTER TABLE "Servico" RENAME COLUMN "texto" TO "titulo";
ALTER TABLE "Servico" ADD COLUMN "descricao" TEXT;
UPDATE "Servico" SET "descricao" = "titulo" WHERE "descricao" IS NULL;
ALTER TABLE "Servico" ALTER COLUMN "descricao" SET NOT NULL;
ALTER TABLE "Servico" RENAME CONSTRAINT "Mensagem_pkey" TO "Servico_pkey";
ALTER TABLE "Servico" ADD COLUMN "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Servico"
  ADD CONSTRAINT "Servico_autorId_fkey"
  FOREIGN KEY ("autorId") REFERENCES "Usuario"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Employees are managed by administrators and are public landing-page data.
CREATE TABLE "Funcionario" (
  "id" SERIAL NOT NULL,
  "nome" TEXT NOT NULL,
  "cargo" TEXT NOT NULL,
  "email" TEXT,
  "telefone" TEXT,
  "fotoUrl" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);
