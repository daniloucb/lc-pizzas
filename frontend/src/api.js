import axios from "axios";

// Defina a URL base para as requisições
const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Funções para interagir com a API

// Função para criar uma category
export const createCategory = (category) => {
  return api.post("/category/create", category);
};

// Função para obter todas as categorys
export const getCategories = () => {
  return api.get("/category");
};

// Função para deletar uma category
export const deleteCategory = (id) => {
  return api.delete(`/category/${id}`);
};

// Função para criar um produto
export const createProduct = (product) => {
  return api.post("/products", product);
};

// // Função para obter todos os produtos
// export const getProducts = () => {
//   return api.get("/products");
// };

// Função para obter os produtos de uma category específica
export const getProducts = (categoryId) => {
  const url = categoryId ? `/products?category=${categoryId}` : "/products";
  return api.get(url);
};

// Função para criar um pedido
export const createOrder = (order) => {
  return api.post("/orders", order);
};

// Função para atualizar o status do pedido
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/orders/${orderId}/status`, { status });
};

// Função para adicionar um item ao pedido
export const addItemToOrder = (orderId, item) => {
  return api.post(`/orders/${orderId}/itens`, item);
};

// Função de login
export const handleLogin = (event, data, navigate, setError) => {
  event.preventDefault();
  const { email, password } = data;

  navigate("/panel"); // Redirecionar para a página inicial ou página protegida
  // Exemplo de validação simples
  // if (email === "user@example.com" && password === "password") {
  //   navigate("/panel"); // Redirecionar para a página inicial ou página protegida
  // } else {
  //   setError("Credenciais inválidas");
  // }
};
