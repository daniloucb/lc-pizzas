import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    setProductDetails(product);
  }, [product]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const handleAddToCart = () => {
    if (productDetails) {
      // Pass the product with quantity and any other details (if any)
      onAddToCart({
        ...productDetails,
        quantity,
        details, // Include details if needed
      });

      // Close the modal after adding the product to the cart
      onClose();
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!isOpen || !productDetails) return null;

  return (
    <ModalOverlay>
      <ModalContainer ref={modalRef}>
        <ModalBody>
          <ProductImageContainer>
            <ProductImage
              src={productDetails.banner}
              alt={productDetails.name}
            />
          </ProductImageContainer>
          <ProductInfo>
            <h3>{productDetails.name}</h3>
            <p>{productDetails.description}</p>
            <PriceText>R$ {Number(product.price).toFixed(2)}</PriceText>
            <DetailsInput
              placeholder="Retirar queijo, ovo..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <ModalFooter>
              <QuantityContainer>
                <button onClick={decreaseQuantity}>-</button>
                <div>{quantity}</div>
                <button onClick={increaseQuantity}>+</button>
              </QuantityContainer>
              <AddToCartButton onClick={handleAddToCart}>
                Adicionar R$ {""}
                {quantity * Number(product.price).toFixed(2)}
              </AddToCartButton>
            </ModalFooter>
          </ProductInfo>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: row;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 15px;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProductImageContainer = styled.div`
  flex-shrink: 0;
  margin-right: 20px;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  flex-grow: 1;
  padding-left: 30px;
  text-align: left;

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    font-size: 16px;
    margin: 10px 0;
    color: #555;
  }

  @media (max-width: 768px) {
    padding-left: 0;
    text-align: center;
  }
`;

const PriceText = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
`;

const DetailsInput = styled.textarea`
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  resize: none;
  min-height: 80px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-height: 60px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    font-size: 20px;
    font-weight: bold;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    height: 40px;
    width: 40px;
  }

  div {
    font-size: 20px;
    font-weight: bold;
    padding: 5px 15px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 40px;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
  }
`;

export default ProductModal;
