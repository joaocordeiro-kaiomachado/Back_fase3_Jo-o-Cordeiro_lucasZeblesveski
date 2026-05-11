const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // logs

const app = express();

// servidor
app.listen(3000, () => {
    console.log("Servidor no ar!!!");
});

// conexão banco
const connection = new sqlite3.Database('./database.db', (error) => {

    if (error) {
        console.log('Erro na conexão ao sqlite: ' + error.message);
        return;
    } else {
        console.log('Conexão com SQLite deu certo!');
    }

});

// cria tabela
connection.serialize(() => {

    connection.run(
        'CREATE TABLE IF NOT EXISTS tasks (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'task TEXT, ' +
        'status TEXT)'
    );

});

// rota principal
app.get('/', (req, res) => {

    connection.all('SELECT * FROM tasks', (err, rows) => {

        if (err) {
            console.log(err.message);
            res.send('Erro ao obter tarefas');
        } else {
            res.send(rows);
        }

    });

});

// rota insere poucos
app.get('/insere-poucos', (req, res) => {

    const query = 'INSERT INTO tasks (task, status) VALUES (?, ?)';

    connection.run(query, ['Estudar Node.js', 'pendente']);
    connection.run(query, ['Fazer atividade', 'concluído']);
    connection.run(query, ['Treinar lógica', 'em andamento']);
    connection.run(query, ['Configurar banco SQLite', 'pendente']);

    connection.run(query, ['Estudar Express', 'pendente'], (err) => {

        if (err) {
            res.send('Erro ao inserir tarefas');
        } else {
            res.send('5 tarefas inseridas com sucesso!');
        }

    });

});

// rota popula muitos
app.get('/popula-muitos', (req, res) => {

    const query = 'INSERT INTO tasks (task, status) VALUES (?, ?)';

    const statusLista = [
        'pendente',
        'concluído',
        'em andamento'
    ];

    for (let i = 1; i <= 100; i++) {

        const tarefa = `Tarefa ${i}`;

        const status =
            statusLista[Math.floor(Math.random() * statusLista.length)];

        connection.run(query, [tarefa, status]);

    }

    res.send('100 tarefas inseridas com sucesso!');

});
