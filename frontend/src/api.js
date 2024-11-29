import axios from "axios";

// Defina a URL base para as requisições
const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Funções para interagir com a API

// Função para criar uma categoria
export const createCategory = (category) => {
  return api.post("/categoria/create", category);
};

// Função para obter todas as categorias
export const getCategories = () => {
  return api.get("/categoria");
};

// Função para deletar uma categoria
export const deleteCategory = (id) => {
  return api.delete(`/categoria/${id}`);
};

// Função para criar um produto
export const createProduct = (product) => {
  return api.post("/produto", product);
};

// Função para obter todos os produtos
export const getProductsByCategory = (categoryId) => {
  return api.get(`/produto?categoria=${categoryId}`);
};

// api.js
export const getProducts = () => {
  return api.get(`/produtos`);
};


// Função para criar um pedido
export const createOrder = (order) => {
  return api.post("/pedido", order);
};

// Função para atualizar o status do pedido
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/pedido/${orderId}/status`, { status });
};

// Função para adicionar um item ao pedido
export const addItemToOrder = (pedidoId, item) => {
  return api.post(`/pedido/${pedidoId}/itens`, item);
};

export const handleLogin = (event, data, navigate, setError) => {
  event.preventDefault();
  const { email, password } = data;

  navigate("/panel"); // Redirecionar para a página inicial ou página protegida
  // Exemplo de validação simples
  // if (email === "user@example.com" && password === "password") {
  // navigate("/panel"); // Redirecionar para a página inicial ou página protegida
  // } else {
  //   setError("Credenciais inválidas");
  // }
};
