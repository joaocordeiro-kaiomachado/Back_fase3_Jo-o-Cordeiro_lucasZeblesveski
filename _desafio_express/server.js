const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Conexão com o banco de dados em arquivo local
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error('Erro ao conectar ao banco:', err.message);
    else console.log('Banco de dados SQLite3 conectado.');
});

// Criação da tabela de produtos
db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL
)`);

// ROTA 1: Página Principal (Exibe os botões e faz a injeção do HTML do banco)
app.get('/', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) return res.status(500).send("Erro no banco de dados.");

        // Construindo a injeção dinâmica de HTML
        let tabelaHtml = '';
        if (rows.length === 0) {
            tabelaHtml = '<p style="color: #777;">O banco de dados está vazio. Escolha uma das opções acima para popular!</p>';
        } else {
            tabelaHtml = `
                <table border="1" style="border-collapse: collapse; width: 50%; margin-top: 20px;">
                    <tr style="background-color: #ddd;">
                        <th>ID</th>
                        <th>Produto</th>
                        <th>Preço</th>
                    </tr>
                    ${rows.map(item => `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.nome}</td>
                            <td>R$ ${item.preco.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>`;
        }

        // Enviando a página com os links/botões requisitados
        res.send(`
            <h1>Desafio Express + SQLite3</h1>
            <hr>
            <div style="margin-bottom: 20px;">
                <a href="/popular-poucos"><button style="padding: 10px; cursor: pointer;">Popular Poucos</button></a>
                <a href="/popular-muitos"><button style="padding: 10px; cursor: pointer; margin-left: 10px;">Popular Muitos</button></a>
                
                <a href="/limpar-banco">
                <button style="padding: 10px; cursor: pointer; margin-left: 10px; background-color: #ffcccc;">Limpar Banco</button>
</a>
            </div>
            
            <h2>Dados Injetados:</h2>
            ${tabelaHtml}
        `);
    });
});

// --- AS ROTAS DE POPULAÇÃO VÃO ENTRAR NO PRÓXIMO PASSO ---

// ROTA 2: Popular Poucos Registros
app.get('/popular-poucos', (req, res) => {
    const stmt = db.prepare("INSERT INTO produtos (nome, preco) VALUES (?, ?)");

    // Semeando 2 registros simples no banco
    stmt.run("Caderno Universitário", 19.90);
    stmt.run("Caneta Esferográfica", 2.50);
    stmt.finalize();

    // Página de confirmação com o botão para retornar à rota principal
    res.send(`
        <body style="font-family: sans-serif; margin: 30px;">
            <h2 style="color: green;">Sucesso: Poucos registros foram adicionados!</h2>
            <p>Foram inseridos 2 produtos padrão no arquivo SQLite3.</p>
            <hr>
            <a href="/"><button style="padding: 10px; cursor: pointer;">Voltar para a Página Principal</button></a>
        </body>
    `);
});

// ROTA 3: Popular Muitos Registros (Utilizando laço de repetição)
app.get('/popular-muitos', (req, res) => {
    const stmt = db.prepare("INSERT INTO produtos (nome, preco) VALUES (?, ?)");

    // Loop tradicional para simular carga em lote (15 itens)
    for (let i = 1; i <= 15; i++) {
        stmt.run(`Inserção automatizada de produto ${String.fromCharCode(64 + i)}`, 12.50 * i);
    }
    stmt.finalize();

    // Página de confirmação com o botão para retornar à rota principal
    res.send(`
        <body style="font-family: sans-serif; margin: 30px;">
            <h2 style="color: darkblue;">Sucesso: Carga em lote adicionada!</h2>
            <p>Foram semeados 15 novos registros automatizados no banco de dados.</p>
            <hr>
            <a href="/"><button style="padding: 10px; cursor: pointer;">Voltar para a Página Principal</button></a>
        </body>
    `);
});

// ROTA AUXILIAR: Limpar Banco (Garante que a rota de entrada volte a carregar zerada)
app.get('/limpar-banco', (req, res) => {
    db.run("DELETE FROM produtos", [], (err) => {
        if (err) return res.status(500).send("Erro ao limpar a tabela.");
        // Redireciona o navegador de volta para a rota raiz
        res.redirect('/');
    });
});

// 3. Colocando o servidor em modo de escuta ativa
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});