import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCategories } from "../api";

const Categories = ({ selectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Carregar categorias da API
    getCategories().then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <CategoryList>
      {categories.map((category) => (
        <CategoryTag
          key={category.idCategoria} // Supondo que idCategoria seja único
          isSelected={category.idCategoria === selectedCategory}
          onClick={() =>
            selectCategory(
              category.idCategoria === selectedCategory
                ? null
                : category.idCategoria
            )
          }
        >
          {category.nomeCategoria}
        </CategoryTag>
      ))}
    </CategoryList>
  );
};

const CategoryList = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  flex: 2;
`;

const CategoryTag = styled.div`
  padding: 8px 20px;
  background-color: ${(props) => (props.isSelected ? "#007bff" : "#f0f0f0")};
  color: ${(props) => (props.isSelected ? "white" : "black")};
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ddd;
  }
`;

export { Categories };
