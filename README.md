# Sistema de Gerenciamento de Estoque

Um sistema web completo para gerenciamento de estoque com interface moderna e API REST.

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite
- **Outras**: CORS para requisições cross-origin

## Funcionalidades

- ✅ Cadastro de produtos com nome, categoria, quantidade e preço
- ✅ Listagem de produtos em tabela responsiva
- ✅ Edição de produtos existentes
- ✅ Exclusão de produtos com confirmação
- ✅ Estatísticas em tempo real (total de produtos, valor total do estoque)
- ✅ Interface responsiva para desktop e mobile
- ✅ Notificações de sucesso e erro
- ✅ Validação de dados no frontend e backend

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

## Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone https://github.com/gabrielfonsecadev/Paper-Estoque
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

## Como Executar

1. **Inicie o servidor**
   ```bash
   npm start
   ```
   ou
   ```bash
   node server.js
   ```

2. **Acesse a aplicação**
   - Abra seu navegador
   - Acesse: `http://localhost:3000`

3. **Parar o servidor**
   - Pressione `Ctrl + C` no terminal


## API Endpoints

A aplicação fornece os seguintes endpoints da API:

### Produtos

- **GET** `/api/items` - Lista todos os produtos
- **POST** `/api/items` - Cria um novo produto
- **PUT** `/api/items/:id` - Atualiza um produto existente
- **DELETE** `/api/items/:id` - Remove um produto

### Exemplo de Produto (JSON)

```json
{
  "id": 1,
  "nome": "Notebook Dell",
  "categoria": "Eletrônicos",
  "quantidade": 10,
  "preco": 2500.00
}
```

## Banco de Dados

O projeto utiliza SQLite como banco de dados, que é criado automaticamente na primeira execução. O arquivo `estoque.db` será gerado na raiz do projeto.
