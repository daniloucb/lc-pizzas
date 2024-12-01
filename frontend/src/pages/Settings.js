import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// Importing API functions
import {
  createCategory,
  getCategories,
  createProduct,
  getProducts,
  deleteCategory,
} from "../api";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    banner: "",
    categoryId: "", // holds the category ID for products
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data); // Adjust based on API response structure
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data); // Adjust based on API response structure
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return; // Avoid empty category
    try {
      const response = await createCategory({ name: newCategory });
      console.log(response);
      setCategories((prevCategories) => [
        ...prevCategories,
        response.data.category, // Adjust based on API response structure
      ]);
      setNewCategory(""); // Reset input
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      loadCategories(); // Reload categories after deletion
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return; // Validate non-empty name and price
    try {
      const response = await createProduct(newProduct);
      console.log(response);
      setProducts((prevProducts) => [...prevProducts, response]);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        banner: "",
        categoryId: "",
      }); // Reset input fields
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const groupedProducts = products.reduce((acc, product) => {
    console.log(product)
    const category = categories.find((category) => {
      return category.id === product.categoryId;
    });
    if (category) {
      const categoryName = category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
    } else {
      console.warn(`Category not found for product: ${product.id}`);
    }
    return acc;
  }, {});

  return (
    <SettingsContainer>
      <Header>
        <h1>Settings</h1>
        <BackButton onClick={handleGoBack}>Go Back</BackButton>
      </Header>

      <Section>
        <h2>Categories</h2>
        <InputRow>
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add</button>
        </InputRow>
        <CategoryList>
          {categories.map((category) => (
            <CategoryItem key={category.id}>
              <span>{category.name}</span>
              <button onClick={() => handleDeleteCategory(category.id)}>
                Delete
              </button>
            </CategoryItem>
          ))}
        </CategoryList>
      </Section>

      <Section>
        <h2>Products</h2>
        <InputRow>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <select
            value={newProduct.categoryId}
            onChange={(e) =>
              setNewProduct({ ...newProduct, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Banner URL"
            value={newProduct.banner}
            onChange={(e) =>
              setNewProduct({ ...newProduct, banner: e.target.value })
            }
          />
          <button onClick={handleAddProduct}>Add</button>
        </InputRow>

        {Object.keys(groupedProducts).map((category) => (
          <ProductCategorySection key={category}>
            <h3>{category}</h3>
            <ProductList>
              {groupedProducts[category].map((product) => (
                <ProductCard key={product.id}>
                  <ProductImage src={product.banner} alt={product.name} />
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>
                    R$ {Number(product.price).toFixed(2)}
                  </ProductPrice>
                  <DeleteButton onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </DeleteButton>
                </ProductCard>
              ))}
            </ProductList>
          </ProductCategorySection>
        ))}
      </Section>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ccc;
  }
`;

const Section = styled.div`
  background-color: white;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  input,
  select {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: calc(100% - 20px);
    max-width: 200px;
  }
  button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    width: calc(100% - 20px);
    max-width: 150px;
    &:hover {
      background-color: #45a049;
    }
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  button {
    background-color: red;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const ProductCategorySection = styled.div`
  margin-top: 20px;
`;

const ProductList = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 20px 0;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 200px;
  padding: 15px;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductName = styled.h4`
  font-size: 18px;
  margin: 10px 0;
`;

const ProductPrice = styled.p`
  color: #888;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #d32f2f;
  }
`;

export default SettingsPage;
