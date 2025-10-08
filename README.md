Teste técnico realizado para a Ambisis

## Requisitos

Node 18.18 ou superior<br>
MySQL Workbench<br>
MySQL Server<br>

## Instalação e Execução

Clone este projeto:

```
git clone https://github.com/Matthzin/ambisis_teste.git
```

Após, entre na pasta do projeto e execute:

```bash
npm install
```

Na raíz do projeto, crie um arquivo chamado `.env`<br>
Dentro deste arquivo, inclua:

```bash
DATABASE_URL="mysql://usuário:senha@localhost:3306/mydb"
```

- Troque `usuário` e `senha` pelo seu próprio usuário e senha respectivamente. Essa conexão irá gerar um novo esquema no seu MySQL chamado `mydb`. Você pode alterar este nome no final da URL para o nome que quiser que seja gerado seu esquema;<br>

- Caso você tiver outra porta definida para `localhost` no MySQL Server, troque pela correspondente. A porta padrão é `3306`;<br><br>

Execute a migração do Prisma para gerar o banco no MySQL:

```bash
npx prisma migrate dev
```

- Esse comando gera uma migração no MySQL. É possível visualizá-la no MySQL Workbench e executar comandos SQL como INSERT, DELETE ou UPDATE;
- 

Execute a geração do Prisma Client

```bash
npx prisma generate
```

Por fim, execute o projeto:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para começar a utilizar o projeto;

