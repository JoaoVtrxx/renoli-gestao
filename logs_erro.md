PS C:\Users\jdalp\Documents\Projects\renoli-gestao> npm run dev

> renoli-gestao@0.1.0 dev
> next dev --turbo

▲ Next.js 15.5.4 (Turbopack)

- Local: http://localhost:3000
- Network: http://192.168.100.7:3000
- Environments: .env.local, .env

✓ Starting...
✓ Compiled middleware in 419ms
✓ Ready in 3s
○ Compiling /veiculos/novo ...
⚠ ./src/server/api/routers/veiculo.ts:32:22
Module not found: Can't resolve 'pdf-parse/lib/pdf-parse.js'
30 | // Aponta para o arquivo exato da lógica para evitar confusão do Bundler
31 | // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports

> 32 | const pdfParse = require('pdf-parse/lib/pdf-parse.js');

     |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

33 |
34 | // Executa a função (agora temos certeza que é a função correta)
35 | // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment

Import trace:
App Route:
./src/server/api/routers/veiculo.ts
./src/server/api/root.ts
./src/app/api/trpc/[trpc]/route.ts

https://nextjs.org/docs/messages/module-not-found

✓ Compiled /veiculos/novo in 3.4s
⚠ ./src/server/api/routers/veiculo.ts:32:22
Module not found: Can't resolve 'pdf-parse/lib/pdf-parse.js'
30 | // Aponta para o arquivo exato da lógica para evitar confusão do Bundler
31 | // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports

> 32 | const pdfParse = require('pdf-parse/lib/pdf-parse.js');

     |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

33 |
34 | // Executa a função (agora temos certeza que é a função correta)
35 | // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment

Import trace:
App Route:
./src/server/api/routers/veiculo.ts
./src/server/api/root.ts
./src/app/api/trpc/[trpc]/route.ts

https://nextjs.org/docs/messages/module-not-found

GET /api/auth/session 200 in 3965ms
GET /api/trpc/cliente.getAll?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D 200 in 3966ms
GET /veiculos/novo 200 in 3986ms
prisma:query SELECT "public"."Cliente"."id", "public"."Cliente"."nome", "public"."Cliente"."cpf", "public"."Cliente"."rg", "public"."Cliente"."dataNascimento", "public"."Cliente"."celular", "public"."Cliente"."telefoneFixo", "public"."Cliente"."email", "public"."Cliente"."cep", "public"."Cliente"."rua", "public"."Cliente"."numero", "public"."Cliente"."complemento", "public"."Cliente"."bairro", "public"."Cliente"."cidade", "public"."Cliente"."estado", "public"."Cliente"."aceitaMarketing", "public"."Cliente"."observacoesNegocios", "public"."Cliente"."createdAt", "public"."Cliente"."updatedAt", "public"."Cliente"."profissaoId", "public"."Cliente"."estadoCivilId" FROM "public"."Cliente" WHERE 1=1 ORDER BY "public"."Cliente"."nome" ASC LIMIT $1 OFFSET $2
prisma:query SELECT COUNT(*) AS "_count$\_all" FROM (SELECT "public"."Cliente"."id" FROM "public"."Cliente" WHERE 1=1 OFFSET $1) AS "sub"
[TRPC] cliente.getAll took 492ms to execute
⚠ ./src/server/api/routers/veiculo.ts:32:22
Module not found: Can't resolve 'pdf-parse/lib/pdf-parse.js'
30 | // Aponta para o arquivo exato da lógica para evitar confusão do Bundler
31 | // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports

> 32 | const pdfParse = require('pdf-parse/lib/pdf-parse.js');

     |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

33 |
34 | // Executa a função (agora temos certeza que é a função correta)
35 | // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment

Import trace:
App Route:
./src/server/api/routers/veiculo.ts
./src/server/api/root.ts
./src/app/api/trpc/[trpc]/route.ts

https://nextjs.org/docs/messages/module-not-found

⚠ ./src/server/api/routers/veiculo.ts:32:22
Module not found: Can't resolve 'pdf-parse/lib/pdf-parse.js'
30 | // Aponta para o arquivo exato da lógica para evitar confusão do Bundler
31 | // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports

> 32 | const pdfParse = require('pdf-parse/lib/pdf-parse.js');

     |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

33 |
34 | // Executa a função (agora temos certeza que é a função correta)
35 | // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment

Import trace:
App Route:
./src/server/api/routers/veiculo.ts
./src/server/api/root.ts
./src/app/api/trpc/[trpc]/route.ts

https://nextjs.org/docs/messages/module-not-found

GET /api/auth/session 200 in 398ms
GET /api/auth/session 200 in 328ms
prisma:query SELECT "public"."Cliente"."id", "public"."Cliente"."nome", "public"."Cliente"."cpf", "public"."Cliente"."rg", "public"."Cliente"."dataNascimento", "public"."Cliente"."celular", "public"."Cliente"."telefoneFixo", "public"."Cliente"."email", "public"."Cliente"."cep", "public"."Cliente"."rua", "public"."Cliente"."numero", "public"."Cliente"."complemento", "public"."Cliente"."bairro", "public"."Cliente"."cidade", "public"."Cliente"."estado", "public"."Cliente"."aceitaMarketing", "public"."Cliente"."observacoesNegocios", "public"."Cliente"."createdAt", "public"."Cliente"."updatedAt", "public"."Cliente"."profissaoId", "public"."Cliente"."estadoCivilId" FROM "public"."Cliente" WHERE 1=1 ORDER BY "public"."Cliente"."nome" ASC LIMIT $1 OFFSET $2
prisma:query SELECT COUNT(*) AS "_count$\_all" FROM (SELECT "public"."Cliente"."id" FROM "public"."Cliente" WHERE 1=1 OFFSET $1) AS "sub"
[TRPC] cliente.getAll took 501ms to execute
GET /api/trpc/cliente.getAll?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D 200 in 885ms
GET /api/auth/session 200 in 478ms
GET /api/auth/session 200 in 477ms
⚠ ./src/server/api/routers/veiculo.ts:32:22
Module not found: Can't resolve 'pdf-parse/lib/pdf-parse.js'
30 | // Aponta para o arquivo exato da lógica para evitar confusão do Bundler
31 | // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports

> 32 | const pdfParse = require('pdf-parse/lib/pdf-parse.js');

     |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

33 |
34 | // Executa a função (agora temos certeza que é a função correta)
35 | // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment

Import trace:
App Route:
./src/server/api/routers/veiculo.ts
./src/server/api/root.ts
./src/app/api/trpc/[trpc]/route.ts

https://nextjs.org/docs/messages/module-not-found

PDF Buffer criado, tamanho: 61225
PDF Buffer criado, tamanho: 61225
Erro ao processar PDF: Error: Erro ao extrair texto do PDF: Cannot find module 'pdf-parse/lib/pdf-parse.js'
at parsePDF (src\server\api\routers\veiculo.ts:47:11)
at <unknown> (src\server\api\routers\veiculo.ts:335:28)
at async (src\server\api\trpc.ts:96:18)
45 | return fullText;
46 | } catch (error) {

> 47 | throw new Error(

     |           ^

48 | `Erro ao extrair texto do PDF: ${error instanceof Error ? error.message : String(error)}`
49 | );
50 | }
[TRPC] veiculo.parseDocument took 370ms to execute
❌ tRPC failed on veiculo.parseDocument: Erro ao extrair texto do PDF: Cannot find module 'pdf-parse/lib/pdf-parse.js'
POST /api/trpc/veiculo.parseDocument?batch=1 200 in 824ms
