const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // ativa modo detalhado (logs)
const app = express();

app.listen(3000, () => {
    console.log("Servidor no ar!!!");
});

const connection = new sqlite3.Database('./database.db', (error) => {

    if (error) {
        console.log('Erro na conexão ao sqlite: ' + error.message);
        return;
    }
    else {
        console.log('Conexão com SQLite (arquivo local) bem-sucedida!');
    }
});

connection.serialize(() => {
    connection.run(
        'CREATE TABLE IF NOT EXISTS tasks (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'task TEXT, ' +
        'status TEXT)'
    );
});

app.get('/', (req, res) => {

    connection.all('SELECT * FROM tasks', (err, rows) => {

        if (err) {
            console.log(err.message); // corrigido (mensage -> message)
            res.send('Erro ao obter a lista de tarefas');
        }
        else {
            res.send(rows); // envia os dados para o cliente
        }

    });
});

app.get('/setup', (req, res) => {

    const query = 'INSERT INTO tasks (task, status) VALUES (?, ?)'; // corrigido: estava dentro do comentário

    connection.run(query, ['Estudar rotas do Express', 'concluído']);
    connection.run(query, ['Configurar banco SQLite', 'em andamento']);
    connection.run(query, ['Estudar para a prova de Matemática', 'Ajuda pelo amor de deus']);
    connection.run(query, ['Estudar para a prova de Banco de Dados', 'pendente']);
    connection.run(query, ['Fazer as tarefas do João', 'Pendente']);
    connection.run(query, ['Testar a extensao SQLite Viewer', 'pendente'], (err) => {
        if (err) {
            res.send('Erro ao popular dados');
        }
        else {
            res.send('<h1>Ambiente configurado com sucesso</h1><p>Vá para a rota principal para ver os dados</p>');
        }
    });
});


/*
==================== EXPLICAÇÃO DO CÓDIGO ====================

1. IMPORTAÇÃO DE BIBLIOTECAS
- express: framework para criar o servidor web
- sqlite3: biblioteca para usar banco SQLite
- verbose(): ativa logs detalhados

2. INICIALIZAÇÃO DO SERVIDOR
- app.listen(3000): inicia o servidor na porta 3000

3. CONEXÃO COM O BANCO
- new sqlite3.Database(): cria/abre o arquivo database.db
- callback trata erro ou sucesso da conexão

4. CRIAÇÃO DA TABELA
- serialize(): garante execução em ordem
- CREATE TABLE IF NOT EXISTS:
  -> cria a tabela "tasks" se ela não existir
  -> campos:
     id: inteiro, chave primária, auto incremento
     task: texto (descrição da tarefa)
     status: texto (situação da tarefa)

5. ROTA PRINCIPAL "/"
- SELECT * FROM tasks:
  -> busca todas as tarefas
- res.send(rows):
  -> retorna os dados para o navegador

6. ROTA "/setup"
- cria a variável query (INSERT)
- insere vários registros na tabela
- usa "?" para evitar SQL Injection
- último run possui callback:
  -> se erro: retorna mensagem de erro
  -> se sucesso: confirma que o ambiente foi configurado

7. CORREÇÕES FEITAS
- err.mensage -> err.message
- query estava comentada/incorreta dentro da rota
- mantida estrutura original com mínimo de alterações

=============================================================
*/