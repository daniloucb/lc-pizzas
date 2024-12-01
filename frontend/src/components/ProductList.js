import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductItem from "./ProductItem";
import { getProducts } from "../api";

const ProductList = ({ selectedCategory, setSelectedProduct }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Carregar produtos da API
    getProducts().then((response) => {
      setProducts(response.data);
    });
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  return (
    <ProductListContainer>
      {filteredProducts.map((product) => (
        <ProductItem
          setSelectedProduct={setSelectedProduct}
          key={product.id} // Supondo que id seja único
          product={product}
        />
      ))}
    </ProductListContainer>
  );
};

const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Default: 4 columns per row */
  gap: 20px;
  margin: 100px auto;

  /* Responsiveness */
  @media (max-width: 768px) {
    grid-template-columns: repeat(
      2,
      1fr
    ); /* 2 columns per row on medium screens */
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(
      2,
      1fr
    ); /* 2 columns per row on smaller screens */
    gap: 10px;
    margin: 100px auto;
  }
`;

export default ProductList;
