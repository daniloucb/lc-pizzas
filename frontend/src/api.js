import axios from 'axios';

// Defina a URL base para as requisições
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Funções para interagir com a API

// Função para criar uma categoria
export const createCategory = (category) => {
  return api.post('/categoria/create', category);
};

// Função para obter todas as categorias
export const getCategories = () => {
  return api.get('/categoria');
};

// Função para criar um produto
export const createProduct = (product) => {
  return api.post('/produto', product);
};

// Função para obter todos os produtos
export const getProducts = (categoryId) => {
  return api.get(`/produto?categoria=${categoryId}`);
};

// Função para criar um pedido
export const createOrder = (order) => {
  return api.post('/pedido', order);
};

// Função para atualizar o status do pedido
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/pedido/${orderId}/status`, { status });
};

// Função para adicionar um item ao pedido
export const addItemToOrder = (pedidoId, item) => {
  return api.post(`/pedido/${pedidoId}/itens`, item);
};
