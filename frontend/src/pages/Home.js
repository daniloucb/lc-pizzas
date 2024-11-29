import React, { useState } from "react";
import { HeaderTop } from "../components/HeaderTop";
import ProductList from "../components/ProductList";
import styled from "styled-components";
import { Categories } from "../components/CategoryList";
import ProductModal from "../components/ProductModal";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null); // Initial selected category
  const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product for modal
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    if (product) {
      setCartItems((prevCartItems) => {
        const existingProductIndex = prevCartItems.findIndex(
          (item) => item.idProduto === product.idProduto // Verifica pelo ID único do produto
        );

        if (existingProductIndex !== -1) {
          // Produto já existe no carrinho, atualiza quantidade e preço
          const updatedCartItems = [...prevCartItems];
          const existingProduct = updatedCartItems[existingProductIndex];

          const updatedQuantity = existingProduct.quantity + product.quantity;
          const updatedTotalPrice = updatedQuantity * product.price;

          updatedCartItems[existingProductIndex] = {
            ...existingProduct,
            quantity: updatedQuantity,
            totalPrice: updatedTotalPrice,
          };

          return updatedCartItems;
        } else {
          // Produto ainda não está no carrinho, adiciona com quantidade e preço inicial
          const newProduct = {
            ...product,
            totalPrice: product.quantity * product.price,
          };

          return [...prevCartItems, newProduct];
        }
      });

      // Opcional: limpar o produto selecionado ou fechar modal
      setSelectedProduct(null);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTop cartItems={cartItems} setCartItems={setCartItems} />
        <Categories
          selectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </Header>
      <ProductList
        setSelectedProduct={setSelectedProduct}
        selectedCategory={selectedCategory}
      />

      {selectedProduct && (
        <ProductModal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  top: 0;
  width: 100%;
  z-index: 1000;
  position: fixed;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px 0;
`;

export default Home;
