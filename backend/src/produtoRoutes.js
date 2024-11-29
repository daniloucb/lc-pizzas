const express = require('express');
const { db } = require("../index");

const router = express.Router();

// READ: Listar todos os produtos
// Rota acionada quando um cliente fizer uma requisição GET para '/produtos'
router.get("/produtos", (req, res) => {
    // Query SQL para selecionar todos os produtos da tabela 'produtos'
    const query = "SELECT * FROM produtos";

    // Executando a query para obter todos os produtos do banco de dados
    db.query(query, (err, results) => {
        if (err) {
            // Se houver erro na execução da query, retornamos um erro 500
            return res.status(500).json({ error: err.message });
        }

        // Se a query for bem-sucedida, retornamos um código 200 (OK) e os resultados da query (todos os produtos)
        res.status(200).json(results);
    });
});