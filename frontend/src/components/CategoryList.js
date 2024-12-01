import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCategories } from "../api"; // Ensure this path is correct

const Categories = ({ selectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load categories from the API
    getCategories()
      .then((response) => {
        setCategories(response.data); // Assuming response.data is the array of categories
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <CategoryList>
      {categories.map((category) => (
        <CategoryTag
          key={category.id} // Assuming 'id' is unique for each category
          isSelected={category.id === selectedCategory}
          onClick={() =>
            selectCategory(
              category.id === selectedCategory ? null : category.id
            )
          }
        >
          {category.name}
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
