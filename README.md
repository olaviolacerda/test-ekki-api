# Ekki Bank API

API criada em NodeJS para realização de transferências entre contatos. https://ekki-api-olavio.herokuapp.com/

### Requisitos

```
1. Node ~> 10.x
2. Postgres 9.6.12
```

### Instalação

* Projeto
```
yarn  ou npm install
```

* Database

```
createdb dev
yarn sequelize db:migrate 
```

### Executando

```
yarn dev ou npm run dev
```

#### Routes

##### Users
get '/api/users/:id' # Busca usuário, param: id do user
get '/api/users/:id/account' # Busca conta do usuário, param: id
get '/api/users/:id/contacts' # Busca contatos do usuário, param: id
get '/api/users' # Lista usuários da plataforma
post '/api/users' # Cria usuário, params: name, cpf, phone
post '/api/login' # Loga usuário, params: cpf

##### Contatos
post '/api/contacts' # Cria novo contato, param: nickname, relatedUserId (usuário alvo), relatingUserId (usuário fonte)
put '/api/contacts/:contactId' # Edita contato, params: nickname, contactId
delete '/api/contacts/:contactId' # Remove contato da lista de contatos, param: contactId

##### Transações
post '/api/transactions' # Cria transferência, params: amount, fromUserId, toUserId
get '/api/transactions/:userId' # Lista movimentações do usuário, params: userId

