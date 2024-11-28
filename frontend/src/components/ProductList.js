import React from 'react';
import ProductItem from './ProductItem';

// Mock de dados de produtos
const products = [
  {
    id: 1,
    name: 'Hamburguer Clássico',
    price: 15.99,
    image: 'https://via.placeholder.com/150?text=Hamburguer+Clássico'
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    price: 29.99,
    image: 'https://via.placeholder.com/150?text=Hamburguer+Clássico'
  },
  {
    id: 3,
    name: 'Batata Frita',
    price: 8.50,
    image: 'https://via.placeholder.com/150?text=Hamburguer+Clássico'
  },
  {
    id: 4,
    name: 'Suco de Laranja',
    price: 5.00,
    image: 'https://via.placeholder.com/150?text=Hamburguer+Clássico'
  },
];

const ProductList = () => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
