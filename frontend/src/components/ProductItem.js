import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <div className="product-item" style={styles.productItem}>
      <img src={product.image} alt={product.name} style={styles.productImage} />
      <h2>{product.name}</h2>
      <p>Preço: R${product.price.toFixed(2)}</p>
    </div>
  );
};

const styles = {
  productItem: {
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
    width: '200px',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
};

export default ProductItem;
