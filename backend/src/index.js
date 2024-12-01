const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Connect to the database
const db = mysql.createPool({
  host: "localhost",
  user: "danilolc",
  password: "password",
  database: "lcpizzas",
  port: 3306,
});

// SQL queries to create tables
const createUserTable = `
  CREATE TABLE IF NOT EXISTS User (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin', 'delivery') NOT NULL
  );
`;

const createAddressTable = `
  CREATE TABLE IF NOT EXISTS Address (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId CHAR(36) NOT NULL,
    addressStreet VARCHAR(100) NOT NULL,
    addressCity VARCHAR(50) NOT NULL,
    addressState VARCHAR(50) NOT NULL,
    addressZipCode VARCHAR(20) NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
  );
`;

const createCategoryTable = `
  CREATE TABLE IF NOT EXISTS Category (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL
  );
`;

const createProductTable = `
  CREATE TABLE IF NOT EXISTS Product (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    banner VARCHAR(255),
    categoryId CHAR(36),
    FOREIGN KEY (categoryId) REFERENCES Category(id)
  );
`;

const createOrderTable = `
  CREATE TABLE IF NOT EXISTS Orders (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    status BOOLEAN DEFAULT FALSE,
    draft BOOLEAN DEFAULT TRUE,
    name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createItemTable = `
  CREATE TABLE IF NOT EXISTS Item (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    orderId CHAR(36) NOT NULL,
    productId CHAR(36) NOT NULL,
    amount INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Product(id)
  );
`;

// Function to create tables
const createTables = async () => {
  try {
    await db.promise().query(createUserTable);
    console.log("Table User created successfully.");

    await db.promise().query(createAddressTable);
    console.log("Table Address created successfully.");

    await db.promise().query(createCategoryTable);
    console.log("Table Category created successfully.");

    await db.promise().query(createProductTable);
    console.log("Table Product created successfully.");

    await db.promise().query(createOrderTable);
    console.log("Table Order created successfully.");

    await db.promise().query(createItemTable);
    console.log("Table Item created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

createTables();

// Middleware for route protection (authentication logic not implemented)
const isAuthenticated = (req, res, next) => {
  const isUserAuthenticated = true;
  if (!isUserAuthenticated) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  next();
};

// Start the server
const app = express();
app.use(express.json());
app.use(cors());

// Routes

app.post("/category/create", async (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO Category (name) VALUES (?)";
  try {
    // Insert the category and get the result
    const [result] = await db.promise().query(query, [name]);
    // Manually fetch the UUID generated for the inserted row
    const getCategoryQuery = "SELECT id, name FROM Category WHERE name = ?";
    const [newCategory] = await db.promise().query(getCategoryQuery, [name]);

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory[0], // Return the created category
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
});

// Route to get all categories
app.get("/category", async (req, res) => {
  const query = "SELECT * FROM Category";
  try {
    const [categories] = await db.promise().query(query);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// Route to delete a category by ID
app.delete("/category/:id", async (req, res) => {
  const categoryId = req.params.id;
  const query = "DELETE FROM Category WHERE id = ?";
  try {
    const [result] = await db.promise().query(query, [categoryId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
});

// Route to create a product
app.post("/products", async (req, res) => {
  const { name, price, description, banner, categoryId } = req.body;
  const query =
    "INSERT INTO Product (name, price, description, banner, categoryId) VALUES (?, ?, ?, ?, ?)";
  try {
    // Insert the product and get the result
    const [result] = await db
      .promise()
      .query(query, [name, price, description, banner, categoryId]);

    // Manually fetch the inserted product's details
    const getProductQuery =
      "SELECT id, name, price, description, banner, categoryId FROM Product WHERE id = ?";
    const [newProduct] = await db
      .promise()
      .query(getProductQuery, [result.insertId]);

    res.status(201).json(
      newProduct[0], // Return the created product
    );
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Route to get all products or filter by category
app.get("/products", async (req, res) => {
  const { category } = req.query;

  if (category) {
    // Query database for products filtered by category
    const [products] = await db
      .promise()
      .query("SELECT * FROM Product WHERE categoryId = ?", [category]);
    res.json(products);
  } else {
    // Get all products if no category is provided
    const [products] = await db.promise().query("SELECT * FROM Product");
    res.json(products);
  }
});

// Route to create an order
app.post("/orders", async (req, res) => {
  const { name, status, draft } = req.body;
  const query = "INSERT INTO Orders (name, status, draft) VALUES (?, ?, ?)";
  try {
    const [result] = await db.promise().query(query, [name, status, draft]);
    // Directly return the created object
    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: result.insertId,
        name,
        status,
        draft,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Route to update order status
app.put("/orders/:id/status", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const query = "UPDATE Orders SET status = ? WHERE id = ?";
  try {
    const [result] = await db.promise().query(query, [status, orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    const [updatedOrder] = await db
      .promise()
      .query("SELECT * FROM Orders WHERE id = ?", [orderId]);
    res.status(200).json({
      message: "Order status updated",
      order: updatedOrder[0], // Return the updated order object
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
});

// Route to add an item to an order
app.post("/orders/:id/items", async (req, res) => {
  const orderId = req.params.id;
  const { productId, amount } = req.body;
  const query =
    "INSERT INTO Item (orderId, productId, amount) VALUES (?, ?, ?)";
  try {
    const [result] = await db
      .promise()
      .query(query, [orderId, productId, amount]);
    // Directly return the created item object
    res.status(201).json({
      message: "Item added to order",
      item: {
        id: result.insertId,
        orderId,
        productId,
        amount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
});

// Example protected route
app.get("/profile", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "User profile data" });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { db };
