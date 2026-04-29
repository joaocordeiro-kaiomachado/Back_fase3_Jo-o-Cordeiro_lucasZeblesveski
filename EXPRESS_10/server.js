/* ===== AULA BACK_FASE3 - EXPRESS 10: CONECTAR COM BANCO DE DADOS =====
 *
 * NOVO CONCEITO: BANCO DE DADOS
 *
 * Um servidor não trabalha sozinho.
 * Ele precisa de um lugar para armazenar dados.
 *
 * SQLite = banco de dados local (arquivo .db no seu projeto)
 *
 * FLUXO:
 * Cliente → Express → SQLite → Retorna dados → Cliente
 */


const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // ativa modo detalhado (logs)
const app = express();


/* ===== INICIAR SERVIDOR =====
 * O servidor começa a rodar na porta 3000
 */
app.listen(3000, () => {
    console.log("Servidor no ar!!!");
});


/* ===== CONEXÃO COM BANCO DE DADOS (SQLITE) =====
 *
 * Cria ou abre o arquivo database.db
 * Se não existir, ele cria automaticamente
 */
const connection = new sqlite3.Database('./database.db', (error) => {

    if (error) {
        console.log('Erro na conecão ao sqlite: ' + error.message);
        return;
    }
    else {
        console.log('Conexão com SQLite (arquivo local) bem-sucedida!');
    }
});


/* ===== PREPARAÇÃO DO AMBIENTE =====
 *
 * Garante que a tabela "tasks" exista
 * Se não existir, ela será criada
 */
connection.serialize(() => {
    connection.run(
        'CREATE TABLE IF NOT EXISTS tasks (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'task TEXT, ' +
        'status TEXT)'
    );
});


/* ===== ROTA: BUSCAR TODAS AS TAREFAS =====
 *
 * Quando alguém acessa:
 * http://localhost:3000/
 *
 * O servidor:
 * 1. Consulta o banco
 * 2. Busca todas as tarefas
 * 3. Retorna os dados em JSON
 */
app.get('/', (req, res) => {

    connection.all('SELECT * FROM tasks', (err, rows) => {

        if (err) {
            console.log(err.mensage);
            res.send('Erro ao obter a lista de tarefas');
        }
        else {
            res.send(rows); // envia os dados para o cliente
        }

    });
});


/* ===== CONCEITOS IMPORTANTES =====
 *
 * SQLITE = Banco de dados local (arquivo)
 *
 * Tabela 'tasks':
 * | id | task   | status |
 * |----|--------|--------|
 * | 1  | Estudar| ativo  |
 * | 2  | Treinar| feito  |
 *
 * SELECT * FROM tasks
 * = "Seleciona TODOS os dados da tabela tasks"
 */


/* ===== COMO USAR =====
 *
 * 1. Execute o arquivo:
 *    node server.js
 *
 * 2. Abra no navegador:
 *    http://localhost:3000/
 *
 * 3. O servidor irá:
 *    - Criar o banco automaticamente (se não existir)
 *    - Criar a tabela "tasks" (se não existir)
 *    - Retornar todas as tarefas cadastradas
 *
 * 4. O resultado será um JSON com as tarefas:
 *    [
 *      { id: 1, task: "Estudar", status: "ativo" },
 *      { id: 2, task: "Treinar", status: "feito" }
 *    ]
 */


/* ===== FLUXO COMPLETO =====
 *
 * 1. Cliente acessa: http://localhost:3000/
 * 2. Express recebe a requisição
 * 3. Express consulta o SQLite
 * 4. SQLite executa: SELECT * FROM tasks
 * 5. SQLite retorna: [tarefa1, tarefa2, ...]
 * 6. Express envia os dados
 * 7. Cliente recebe um JSON com as tarefas
 */
