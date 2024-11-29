import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"; // Importando o Link para navegação

const OrdersList = () => {
  const [orders] = useState([
    { id: 1, customer: "João", status: "Fila", total: 20.5 },
    { id: 2, customer: "Maria", status: "Pronto", total: 15.0 },
    { id: 3, customer: "Carlos", status: "Fila", total: 18.2 },
  ]);

  const [activeTab, setActiveTab] = useState("Fila"); // Track active tab

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <OrdersContainer>
      <Header>
        <h1>Pedidos</h1>
        {/* Link para a tela de configurações */}
        <SettingsLink to="/settings">Configurações da lanchonete</SettingsLink>
      </Header>

      <TabContainer>
        <TabButton
          active={activeTab === "Fila"}
          onClick={() => setActiveTab("Fila")}
        >
          Pedidos na Fila
        </TabButton>
        <TabButton
          active={activeTab === "Pronto"}
          onClick={() => setActiveTab("Pronto")}
        >
          Pedidos Prontos
        </TabButton>
      </TabContainer>

      <OrdersListContainer>
        {filteredOrders.map((order) => (
          <OrderItem key={order.id}>
            <OrderDetails>
              <p>
                <strong>Cliente:</strong> {order.customer}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> R$ {order.total.toFixed(2)}
              </p>
            </OrderDetails>
            <ButtonContainer>
              {order.status !== "Pronto" && <button>Marcar como pronto</button>}
              <button>Ver Detalhes</button>
            </ButtonContainer>
          </OrderItem>
        ))}
      </OrdersListContainer>
    </OrdersContainer>
  );
};

const OrdersContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SettingsLink = styled(Link)`
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  background-color: ${(props) => (props.active ? "#4caf50" : "#f0f0f0")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const OrdersListContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrderDetails = styled.div`
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
`;

export default OrdersList;
