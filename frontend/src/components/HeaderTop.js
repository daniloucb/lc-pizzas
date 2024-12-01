import React, { useEffect, useState } from "react";
import styled from "styled-components";

export const HeaderTop = ({ cartItems, setCartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleCartMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!cartItems.length) setIsMenuOpen(false);
  }, [cartItems]);

  const removeItemFromCart = async (itemId) => {
    await setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  return (
    <HeaderComponent>
      <Nav>
        <LogoContainer>
          <h1>LC Pizzas</h1>
        </LogoContainer>
        <CartContainer onClick={toggleCartMenu}>
          <CartIcon>🛒</CartIcon>
          <CartCount>{cartItems.length}</CartCount>
        </CartContainer>
      </Nav>

      {isMenuOpen && (
        <CartMenu>
          <h2>Itens no Carrinho</h2>
          {cartItems.length === 0 ? (
            <p>O carrinho está vazio.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <CartItem key={item.id}>
                  <CartItemImage
                    src={item.banner}
                    alt={item.name}
                  />
                  <CartItemDetails>
                    <CartItemName>
                      {item.name} x{item.quantity}
                    </CartItemName>
                    <CartItemPrice>
                      R$ {item.quantity * Number(item.price).toFixed(2)}
                    </CartItemPrice>
                  </CartItemDetails>
                  <RemoveButton
                    onClick={() => removeItemFromCart(item.id)}
                  >
                    Remover
                  </RemoveButton>
                </CartItem>
              ))}
            </ul>
          )}
          <CloseButton onClick={toggleCartMenu}>Efetuar pedido</CloseButton>
        </CartMenu>
      )}
    </HeaderComponent>
  );
};

// Styled Components
const HeaderComponent = styled.header`
  width: 100%;
  margin-bottom: 20px;
`;

const Nav = styled.nav`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;

  h1 {
    font-size: 24px;
    color: #333;
  }
`;

const CartContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const CartIcon = styled.div`
  font-size: 30px;
  margin-right: 8px;
`;

const CartCount = styled.div`
  font-size: 18px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  padding: 4px 10px;
  position: absolute;
  top: -8px;
  right: -8px;
`;

const CartMenu = styled.div`
  position: absolute;
  top: 100px;
  right: 10px;
  width: 300px;
  background-color: white;
  box-shadow: 0 0px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
`;

const CartItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const CartItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`;

const CartItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CartItemName = styled.p`
  margin: 0;
  font-weight: bold;
`;

const CartItemPrice = styled.p`
  margin: 0;
  color: #555;
`;

const RemoveButton = styled.button`
  margin-left: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const CloseButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #d32f2f;
  }
`;

export default HeaderTop;
