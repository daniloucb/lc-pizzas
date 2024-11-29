const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Conecta no banco de dados
const db = mysql.createPool({
  host: "localhost",
  user: "danilolc",
  password: "password",
  database: "lcpizzas",
  port: 3306,
});

// SQL queries to create tables
const createCategoriaTable = `
  CREATE TABLE IF NOT EXISTS CATEGORIA (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nomeCategoria VARCHAR(50) NOT NULL
  );
`;

const createProdutoTable = `
  CREATE TABLE IF NOT EXISTS PRODUTO (
    idProduto INT AUTO_INCREMENT PRIMARY KEY,
    nomeProduto VARCHAR(50) NOT NULL,
    precoProduto DECIMAL(10, 2) NOT NULL,
    descricaoProduto TEXT,
    bannerProduto VARCHAR(255),
    idCategoria INT,
    FOREIGN KEY (idCategoria) REFERENCES CATEGORIA(idCategoria)
  );
`;

const createPedidoTable = `
  CREATE TABLE IF NOT EXISTS PEDIDO (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    dataPedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    totalPedido DECIMAL(10, 2) NOT NULL,
    observacoesPedido TEXT
  );
`;

const createItensPedidoTable = `
  CREATE TABLE IF NOT EXISTS ITENS_PEDIDO (
    idItens INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    idProduto INT NOT NULL,
    quantidadeItens INT NOT NULL,
    precoUnitario_Itens DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES PEDIDO(idPedido),
    FOREIGN KEY (idProduto) REFERENCES PRODUTO(idProduto)
  );
`;

// Function to create tables
const createTables = async () => {
  try {
    await db.promise().query(createCategoriaTable);
    console.log("Tabela CATEGORIA criada com sucesso.");

    await db.promise().query(createProdutoTable);
    console.log("Tabela PRODUTO criada com sucesso.");

    await db.promise().query(createPedidoTable);
    console.log("Tabela PEDIDO criada com sucesso.");

    await db.promise().query(createItensPedidoTable);
    console.log("Tabela ITENS_PEDIDO criada com sucesso.");
  } catch (error) {
    console.error("Erro ao criar as tabelas:", error);
  }
};

createTables();

//inicia o server
const app = express();
app.use(express.json());

// definir proteção de rota (não implementado)
app.use(cors());

// Função auxiliar para verificar se o usuário está autenticado (simples exemplo de middleware)
// não implementado
const isAuthenticated = (req, res, next) => {
  const isUserAuthenticated = true;
  if (!isUserAuthenticated) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }
  next();
};

// Serviços para manipulação de dados de Categoria, Produto, Pedido e Itens de Pedido
// Serviços para manipulação de dados de Categoria, Produto, Pedido e Itens de Pedido
class CategoryService {
  constructor() {}

  createCategory(category, res) {
    const SQL = `INSERT INTO CATEGORIA (nomeCategoria) VALUES (?)`;

    db.query(SQL, [category.nomeCategoria], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao criar categoria" });
      }
      const createdCategory = {
        idCategoria: result.insertId,
        nomeCategoria: category.nomeCategoria,
      };
      return res.status(201).json({
        message: "Categoria criada com sucesso",
        data: createdCategory,
      });
    });
  }

  getAllCategories(res) {
    const SQL = `SELECT * FROM CATEGORIA`;

    db.query(SQL, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao listar categorias" });
      }
      return res.json(result);
    });
  }

  // Função para deletar a categoria
  deleteCategory(category, res) {
    const SQL = `DELETE FROM CATEGORIA WHERE idCategoria = ?`;
    db.query(SQL, [category.id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao deletar categoria" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }
      return res.json({ message: "Categoria deletada com sucesso" });
    });
  }
}

class ProductService {
  constructor() {}

  createProduct(product, res) {
    const SQL = `INSERT INTO PRODUTO (nomeProduto, precoProduto, descricaoProduto, bannerProduto, idCategoria) 
                 VALUES (?, ?, ?, ?, ?)`;

    db.query(
      SQL,
      [
        product.nomeProduto,
        product.precoProduto,
        product.descricaoProduto,
        product.bannerProduto,
        product.idCategoria,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao criar produto" });
        }
        const createdProduct = {
          idProduto: result.insertId,
          nomeProduto: product.nomeProduto,
          precoProduto: product.precoProduto,
          descricaoProduto: product.descricaoProduto,
          bannerProduto: product.bannerProduto,
          idCategoria: product.idCategoria,
        };
        return res.status(201).json({
          message: "Produto criado com sucesso",
          data: createdProduct,
        });
      }
    );
  }

  getProductById(id, res) {
    const SQL = `SELECT * FROM PRODUTO WHERE idProduto = ?`;

    db.query(SQL, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao buscar produto" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      return res.json(result[0]);
    });
  }

  getProductsByCategory(idCategoria, res) {
    const SQL = `SELECT * FROM PRODUTO WHERE idCategoria = ?`;

    db.query(SQL, [idCategoria], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao listar produtos" });
      }
      return res.json(result);
    });
  }

  // New function to get all products
  getAllProducts(res) {
    const SQL = `SELECT * FROM PRODUTO`;

    db.query(SQL, (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Erro ao listar todos os produtos" });
      }
      return res.json(result);
    });
  }
}

class OrderService {
  constructor() {}

  createOrder(order, res) {
    const SQL = `INSERT INTO PEDIDO (idCliente, dataPedido, status, totalPedido, observacoesPedido) 
                 VALUES (?, ?, ?, ?, ?)`;

    db.query(
      SQL,
      [
        order.idCliente,
        order.dataPedido,
        order.status,
        order.totalPedido,
        order.observacoesPedido,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao criar pedido" });
        }
        const createdOrder = {
          idPedido: result.insertId,
          idCliente: order.idCliente,
          dataPedido: order.dataPedido,
          status: order.status,
          totalPedido: order.totalPedido,
          observacoesPedido: order.observacoesPedido,
        };
        return res.status(201).json({
          message: "Pedido criado com sucesso",
          data: createdOrder,
        });
      }
    );
  }

  updateOrderStatus(idPedido, status, res) {
    const SQL = `UPDATE PEDIDO SET status = ? WHERE idPedido = ?`;

    db.query(SQL, [status, idPedido], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Erro ao atualizar status do pedido" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }
      return res.json({ message: "Status do pedido atualizado com sucesso" });
    });
  }

  getOrderById(idPedido, res) {
    const SQL = `SELECT * FROM PEDIDO WHERE idPedido = ?`;

    db.query(SQL, [idPedido], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao buscar pedido" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }
      return res.json(result[0]);
    });
  }
}

class ItensPedidoService {
  constructor() {}

  addItemToOrder(pedidoId, item, res) {
    const SQL = `INSERT INTO ITENS_PEDIDO (idPedido, idProduto, quantidadeItens, precoUnitario_Itens) 
                 VALUES (?, ?, ?, ?)`;

    db.query(
      SQL,
      [
        pedidoId,
        item.idProduto,
        item.quantidadeItens,
        item.precoUnitario_Itens,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erro ao adicionar item ao pedido" });
        }
        const createdItem = {
          idItens: result.insertId,
          idPedido: pedidoId,
          idProduto: item.idProduto,
          quantidadeItens: item.quantidadeItens,
          precoUnitario_Itens: item.precoUnitario_Itens,
        };
        return res.status(201).json({
          message: "Item adicionado ao pedido com sucesso",
          data: createdItem,
        });
      }
    );
  }

  removeItemFromOrder(pedidoId, itemId, res) {
    const SQL = `DELETE FROM ITENS_PEDIDO WHERE idPedido = ? AND idItens = ?`;

    db.query(SQL, [pedidoId, itemId], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Erro ao remover item do pedido" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item não encontrado no pedido" });
      }
      return res.json({ message: "Item removido do pedido com sucesso" });
    });
  }
}

// Instancia os serviços
const categoryService = new CategoryService();
const productService = new ProductService();
const orderService = new OrderService();
const itensPedidoService = new ItensPedidoService();

// Rotas
app.post("/categoria/create", isAuthenticated, (req, res) => {
  categoryService.createCategory(req.body, res);
});

app.get("/categoria", (req, res) => {
  categoryService.getAllCategories(res);
});

app.delete("/categoria/:id", (req, res) => {
  categoryService.deleteCategory(req.params, res);
});

app.post("/produto", isAuthenticated, (req, res) => {
  productService.createProduct(req.body, res);
});

app.get("/produto/:id", (req, res) => {
  productService.getProductById(req.params.id, res);
});

app.get('/produtos', (req, res) => {
  productService.getAllProducts(res);
});

app.post("/pedido", isAuthenticated, (req, res) => {
  orderService.createOrder(req.body, res);
});

app.put("/pedido/:id/status", isAuthenticated, (req, res) => {
  orderService.updateOrderStatus(req.params.id, req.body.status, res);
});

app.get("/pedido/:id", isAuthenticated, (req, res) => {
  orderService.getOrderById(req.params.id, res);
});

app.post("/pedido/:pedidoId/itens", isAuthenticated, (req, res) => {
  itensPedidoService.addItemToOrder(req.params.pedidoId, req.body, res);
});

app.delete("/pedido/:pedidoId/itens/:itemId", isAuthenticated, (req, res) => {
  itensPedidoService.removeItemFromOrder(
    req.params.pedidoId,
    req.params.itemId,
    res
  );
});

// Inicia o servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { db };
