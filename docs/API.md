# API da Standart Contabilidade

Contrato atual da API REST da Standart Contabilidade.

## Acesso

Em desenvolvimento, a API fica disponível em:

```text
http://localhost:3000
```

Todas as requisições que enviam dados devem usar:

```http
Content-Type: application/json
```

Em produção, substitua a base URL pela URL gerada pelo deploy da Vercel.

## Resumo das rotas

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| `GET` | `/` | Mensagem de boas-vindas | Não |
| `GET` | `/status` | Health check | Não |
| `POST` | `/auth/register` | Cria uma conta de usuário | Não |
| `POST` | `/auth/login` | Autentica e retorna um JWT | Não |
| `GET` | `/usuarios` | Lista usuários sem `senhaHash` | Não |
| `GET` | `/usuarios/:id` | Busca um usuário por ID | Não |
| `PUT` | `/usuarios/:id` | Atualiza o próprio perfil | JWT do dono |
| `DELETE` | `/usuarios/:id` | Exclui um usuário | JWT de `ADMIN` |
| `GET` | `/servicos` | Lista serviços da contabilidade | Não |
| `POST` | `/servicos` | Cadastra um serviço | JWT de `ADMIN` |
| `PUT` | `/servicos/:id` | Edita um serviço | JWT de `ADMIN` |
| `DELETE` | `/servicos/:id` | Remove um serviço | JWT de `ADMIN` |
| `GET` | `/funcionarios` | Lista a equipe | Não |
| `POST` | `/funcionarios` | Cadastra um funcionário | JWT de `ADMIN` |
| `PUT` | `/funcionarios/:id` | Edita um funcionário | JWT de `ADMIN` |
| `DELETE` | `/funcionarios/:id` | Remove um funcionário | JWT de `ADMIN` |

O cadastro de usuários é feito por `/auth/register`. A API não possui `POST /usuarios`.

## Autenticação

### Cadastro — `POST /auth/register`

Cria um usuário com perfil `USER`. Os campos `nome`, `email` e `senha` são obrigatórios.

#### Requisição

```json
{
  "nome": "João Teste",
  "email": "joao@example.com",
  "senha": "joao123",
  "cidade": "Salinas",
  "frase": "Em testes",
  "planosFuturos": "Aprender Node.js"
}
```

Os campos `cidade`, `frase` e `planosFuturos` são opcionais.

#### Respostas

- `201 Created`: usuário criado;
- `400 Bad Request`: um dos campos obrigatórios não foi enviado;
- `409 Conflict`: o email já está cadastrado;
- `500 Internal Server Error`: erro inesperado.

Exemplo de resposta `201`:

```json
{
  "id": 3,
  "nome": "João Teste",
  "email": "joao@example.com",
  "cidade": "Salinas",
  "frase": "Em testes",
  "planosFuturos": "Aprender Node.js",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-08-19T12:00:00.000Z"
}
```

### Login — `POST /auth/login`

Autentica um usuário e retorna um token JWT.

#### Requisição

```json
{
  "usuario": "vanderlucio",
  "senha": "silva"
}
```

#### Respostas

- `200 OK`: login realizado;
- `401 Unauthorized`: usuário/email ou senha inválidos;
- `500 Internal Server Error`: erro inesperado.

Exemplo de resposta `200`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

O token é assinado com `JWT_SECRET`, contém o `id` e a `role` do usuário e expira em 7 dias.

### Envio do token

Nas rotas protegidas, envie o token no header:

```http
Authorization: Bearer <token>
```

Quando o header não é enviado, a resposta é `401` com:

```json
{
  "erro": "Token não fornecido"
}
```

Para token inválido ou expirado:

```json
{
  "erro": "Token inválido ou expirado"
}
```

## Health check

### Boas-vindas — `GET /`

Retorna `200 OK`:

```json
{
  "mensagem": "Standart Contabilidade API está no ar!"
}
```

### Status — `GET /status`

Retorna `200 OK`:

```json
{
  "status": "ok",
  "timestamp": "2026-08-19T12:00:00.000Z"
}
```

## Usuários

### Listar usuários — `GET /usuarios`

Retorna `200 OK` com um array de usuários. O campo `senhaHash` nunca aparece.

### Buscar usuário — `GET /usuarios/:id`

Retorna `200 OK` com o usuário solicitado ou `404 Not Found`:

```json
{
  "erro": "Usuário não encontrado"
}
```

### Atualizar perfil — `PUT /usuarios/:id`

Requer o token do próprio usuário. O `id` da URL precisa ser igual ao `id` presente no token.

Exemplo de requisição:

```json
{
  "cidade": "Montes Claros",
  "frase": "Frase atualizada",
  "planosFuturos": "Trabalhar com tecnologia",
  "fotoUrl": "https://exemplo.com/foto.jpg"
}
```

Campos de perfil disponíveis: `nome`, `email`, `cidade`, `frase`, `planosFuturos` e `fotoUrl`. Envie somente os campos que devem ser alterados. `senhaHash`, `role`, `id` e `criadoEm` não devem ser enviados pelo cliente.

#### Respostas

- `200 OK`: usuário atualizado, sem `senhaHash`;
- `401 Unauthorized`: token ausente, inválido ou expirado;
- `403 Forbidden`: o token não pertence ao usuário da URL;
- `404 Not Found`: usuário não encontrado.

### Excluir usuário — `DELETE /usuarios/:id`

Requer token com `role: "ADMIN"`. A exclusão também remove as mensagens associadas ao usuário.

#### Respostas

- `204 No Content`: usuário excluído;
- `401 Unauthorized`: token ausente, inválido ou expirado;
- `403 Forbidden`: usuário não é administrador;
- `404 Not Found`: usuário não encontrado.

Resposta de acesso negado:

```json
{
  "erro": "Acesso negado"
}
```

## Serviços

`GET /servicos` é público. As operações de criação, edição e remoção exigem JWT com `role: "ADMIN"`.

```json
{
  "titulo": "Contabilidade consultiva",
  "descricao": "Decisões financeiras mais claras para a sua empresa.",
  "imagemUrl": "https://exemplo.com/contabilidade.jpg"
}
```

`titulo` e `descricao` são obrigatórios. O `autorId` é preenchido pelo usuário administrativo autenticado.

## Funcionários

`GET /funcionarios` é público para a landing page. Criar, editar e remover funcionários exige JWT de administrador.

```json
{
  "nome": "Ana Contadora",
  "cargo": "Contadora",
  "email": "ana@standartcontabilidade.com",
  "telefone": "(38) 99999-9999",
  "fotoUrl": "https://exemplo.com/ana.jpg"
}
```

`nome` e `cargo` são obrigatórios.

## Modelos de dados

### Usuário

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `id` | `Int` | Sim | Gerado automaticamente. |
| `nome` | `String` | Sim | Nome do usuário. |
| `email` | `String` | Sim | Único no banco. |
| `senhaHash` | `String` | Sim | Armazenado com bcrypt; nunca retornado pela API. |
| `cidade` | `String` | Não | Cidade do usuário. |
| `frase` | `String` | Não | Frase pessoal. |
| `planosFuturos` | `String` | Não | Planos para o futuro. |
| `fotoUrl` | `String` | Não | URL da foto; não há upload implementado. |
| `role` | `Role` | Sim | `USER` por padrão ou `ADMIN`. |
| `criadoEm` | `DateTime` | Sim | Preenchido automaticamente. |

### Serviço

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `id` | `Int` | Sim | Gerado automaticamente. |
| `titulo` | `String` | Sim | Nome do serviço. |
| `descricao` | `String` | Sim | Descrição apresentada na landing page. |
| `imagemUrl` | `String` | Não | URL opcional de uma imagem. |
| `autorId` | `Int` | Sim | Chave estrangeira para `Usuario` administrador. |
| `criadoEm` | `DateTime` | Sim | Preenchido automaticamente. |
| `atualizadoEm` | `DateTime` | Sim | Atualizado automaticamente. |

### Funcionário

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `id` | `Int` | Sim | Gerado automaticamente. |
| `nome` | `String` | Sim | Nome do funcionário. |
| `cargo` | `String` | Sim | Função na empresa. |
| `email` | `String` | Não | Email público opcional. |
| `telefone` | `String` | Não | Telefone público opcional. |
| `fotoUrl` | `String` | Não | URL opcional da foto. |

Datas são serializadas em formato ISO 8601 nas respostas JSON.

## Erros e comportamento geral

As respostas de erro usam o formato:

```json
{
  "erro": "Descrição do erro"
}
```

O middleware global retorna `500 Internal Server Error` para erros não tratados:

```json
{
  "erro": "Erro interno do servidor"
}
```

A API registra método, rota, status HTTP e duração de cada requisição no terminal.

## CORS

CORS está habilitado para qualquer origem. A API pode ser consumida por aplicações em `localhost`, Vercel ou outros domínios sem configuração adicional no cliente.

## Dados de desenvolvimento

Depois de executar `node prisma/seed.js`, o banco contém os seguintes usuários de teste:

| Perfil | Email | Senha |
| --- | --- | --- |
| `ADMIN` | `vanderlucio` | `silva` |

Essas credenciais são exclusivas para desenvolvimento local e não devem ser usadas em produção.
