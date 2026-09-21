-- Rename the user model while preserving existing data and relationships.
ALTER TABLE "Mensagem" DROP CONSTRAINT IF EXISTS "Mensagem_autorId_fkey";
ALTER TABLE "Aluno" RENAME TO "Usuario";
ALTER TABLE "Usuario" RENAME CONSTRAINT "Aluno_pkey" TO "Usuario_pkey";
ALTER INDEX "Aluno_email_key" RENAME TO "Usuario_email_key";
ALTER TABLE "Mensagem"
  ADD CONSTRAINT "Mensagem_autorId_fkey"
  FOREIGN KEY ("autorId") REFERENCES "Usuario"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
