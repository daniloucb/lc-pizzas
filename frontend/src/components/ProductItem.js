import React from "react";

const ProductItem = ({ product, setSelectedProduct }) => {
  return (
    <div
      className="product-item"
      style={styles.productItem}
      onClick={() => {
        setSelectedProduct(product);
      }}
    >
      <div style={styles.imageContainer}>
        <img
          src={product.bannerProduto}
          alt={product.nomeProduto}
          style={styles.productImage}
        />
      </div>
      <div style={{ height: "100%" }}>
        <h2 style={styles.productName}>{product.nomeProduto}</h2>
        <p style={styles.productPrice}>
          Preço: R$ {Number(product.precoProduto).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const styles = {
  productItem: {
    border: "1px solid #ddd",
    padding: "15px",
    width: "100%", // Default to full width within grid column
    maxWidth: "180px", // Limit max width to maintain a consistent size
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
    boxSizing: "border-box", // Ensures padding and border are included in width/height calculations
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%", // Fixed width
    minHeight: "150px", // Fixed height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Hide overflow to prevent content from going out of bounds
    backgroundColor: "#f9f9f9", // Optional: Add a background color for better aesthetics
    borderRadius: "4px",
  },
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "fill", // Maintain aspect ratio without distortion
  },
  productName: {
    fontSize: "1rem",
    marginTop: "10px",
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: "0.9rem",
    color: "#555",
  },
};

export default ProductItem;
