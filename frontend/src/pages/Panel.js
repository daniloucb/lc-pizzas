import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: "João", status: "Fila", total: 20.5 },
    { id: 2, customer: "Maria", status: "Pronto", total: 15.0 },
    { id: 3, customer: "Carlos", status: "Fila", total: 18.2 },
  ]);

  const [activeTab, setActiveTab] = useState("Fila");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  // Update the order status to "Pronto"
  const markAsReady = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Pronto" } : order
      )
    );
  };

  // Open the modal with selected order details
  const openModal = (order) => {
    setSelectedOrder(order);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <OrdersContainer>
      <Header>
        <h1>Pedidos</h1>
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
              {order.status !== "Pronto" && (
                <button onClick={() => markAsReady(order.id)}>
                  Marcar como pronto
                </button>
              )}
              <button onClick={() => openModal(order)}>Ver Detalhes</button>
            </ButtonContainer>
          </OrderItem>
        ))}
      </OrdersListContainer>

      {selectedOrder && (
        <Modal>
          <ModalContent>
            <h2>Detalhes do Pedido</h2>
            <p>
              <strong>Cliente:</strong> {selectedOrder.customer}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total:</strong> R$ {selectedOrder.total.toFixed(2)}
            </p>
            <CloseButton onClick={closeModal}>Fechar</CloseButton>
          </ModalContent>
        </Modal>
      )}
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

export default OrdersList;
