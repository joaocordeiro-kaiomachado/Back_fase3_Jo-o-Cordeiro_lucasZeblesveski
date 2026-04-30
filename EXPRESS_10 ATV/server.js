const express = require('express');
const sqlite3 = require('sqlite3').verbose(); //logs
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
        console.log('Conexão com SQLite (arquivo local) deu certo!');
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
            // corrige a  mensagem
            console.log(err.message);
            res.send('Erro ao obter a lista de tarefas');
        }
        // envia os dados  para  o cliente
        else {
            res.send(rows); 
        }

    });
});

app.get('/setup', (req, res) => {

    const query = 'INSERT INTO tasks (task, status) VALUES (?, ?)'; 

    connection.run(query, ['Trabalho do Marcelo', 'concluído']);
    connection.run(query, ['Configurar banco SQLite', 'em andamento']);
    connection.run(query, ['Estudar para a o Enem','pendente' ]);
    connection.run(query, ['Estudar Programação', 'pendente']);
    connection.run(query, ['Fazer as tarefas ', 'Pendente']);
    connection.run(query, ['estudar para as  Provas', 'pendente'], (err) => {
        if (err) {
            res.send('Erro ao popular dados');
        }
        else {
            res.send('<h1>Ambiente configurado com sucesso</h1><p>Vá para a rota principal para visualizar os dados</p>');
        }
    });
});


