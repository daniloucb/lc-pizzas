import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// Importando as funções de API
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
    nomeProduto: "",
    precoProduto: "",
    descricaoProduto: "",
    bannerProduto: "",
    idCategoria: "", // this will hold the category ID, not the name
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data); // Ajuste conforme a estrutura da resposta da API
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data); // Ajuste conforme a estrutura da resposta da API
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const category = await createCategory({ nomeCategoria: newCategory });

      setCategories((prevCategories) => [
        ...prevCategories,
        category.data.data,
      ]);

      setNewCategory(""); // Clear the input field
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      // Envia a requisição para deletar a categoria no banco de dados
      await deleteCategory(id);

      loadCategories();

      // Atualiza a lista de categorias localmente, removendo a categoria com o id especificado
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await createProduct(newProduct);
      setProducts([...products, response.data.data]); // Atualiza a lista de produtos
      setNewProduct({
        nomeProduto: "",
        precoProduto: "",
        descricaoProduto: "",
        bannerProduto: "",
        idCategoria: "", // Reset category to empty
      }); // Limpa os campos de entrada
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleGoBack = () => {
    navigate(-1); // Volta uma página na pilha de navegação
  };

  // Agrupar os produtos por categoria
  // Agrupar os produtos por categoria
  const groupedProducts = products.reduce((acc, product) => {
    // Encontrar a categoria correspondente ao idCategoria do produto
    const category = categories.find(
      (category) => Number(category.idCategoria) === Number(product.idCategoria)
    );

    // Verificar se a categoria foi encontrada
    if (category) {
      const categoryName = category.nomeCategoria;

      // Se a categoria ainda não existir no acumulador, criamos uma nova chave
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      // Adicionamos o produto à categoria correspondente
      acc[categoryName].push(product);
    } else {
      console.warn(
        `Categoria não encontrada para o produto: ${product.idProduto}`
      );
    }

    return acc;
  }, {});

  return (
    <SettingsContainer>
      <Header>
        <h1>Configurações da lanchonete</h1>
        <BackButton onClick={handleGoBack}>Voltar</BackButton>
      </Header>

      <Section>
        <h2>Categorias</h2>
        <InputRow>
          <input
            type="text"
            placeholder="Nova Categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory}>Adicionar</button>
        </InputRow>
        <CategoryList>
          {categories.map((category) => (
            <CategoryItem key={category.idCategoria}>
              <span>{category.nomeCategoria}</span>
              <button
                onClick={() => handleDeleteCategory(category.idCategoria)}
              >
                Excluir
              </button>
            </CategoryItem>
          ))}
        </CategoryList>
      </Section>

      <Section>
        <h2>Produtos</h2>
        <InputRow>
          <input
            type="text"
            placeholder="Nome do Produto"
            value={newProduct.nomeProduto}
            onChange={(e) =>
              setNewProduct({ ...newProduct, nomeProduto: e.target.value })
            }
          />
          <select
            value={newProduct.idCategoria}
            onChange={(e) =>
              setNewProduct({ ...newProduct, idCategoria: e.target.value })
            }
          >
            <option value="">Selecione a Categoria</option>
            {categories.map((category) => (
              <option key={category.idCategoria} value={category.idCategoria}>
                {category.nomeCategoria}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Preço"
            value={newProduct.precoProduto}
            onChange={(e) =>
              setNewProduct({ ...newProduct, precoProduto: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newProduct.descricaoProduto}
            onChange={(e) =>
              setNewProduct({ ...newProduct, descricaoProduto: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL do Banner"
            value={newProduct.bannerProduto}
            onChange={(e) =>
              setNewProduct({ ...newProduct, bannerProduto: e.target.value })
            }
          />
          <button onClick={handleAddProduct}>Adicionar</button>
        </InputRow>

        {/* Exibindo produtos por categoria */}
        {Object.keys(groupedProducts).map((category) => (
          <ProductCategorySection key={category}>
            <h3>{category}</h3>
            <ProductList>
              {groupedProducts[category].map((product) => (
                <ProductCard key={product.idProduto}>
                  <ProductImage
                    src={product.bannerProduto}
                    alt={product.nomeProduto}
                  />
                  <ProductName>{product.nomeProduto}</ProductName>
                  <ProductPrice>
                    R$ {Number(product.precoProduto).toFixed(2)}
                  </ProductPrice>
                  <DeleteButton
                    onClick={() => handleDeleteProduct(product.idProduto)}
                  >
                    Excluir
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
  flex-wrap: wrap; /* Permite que os elementos quebrem para uma nova linha */
  gap: 10px;
  margin-bottom: 20px;

  input,
  select {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: calc(100% - 20px); /* Para evitar overflow */
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

  /* Responsividade */
  @media (max-width: 768px) {
    flex-direction: column; /* Alinha itens verticalmente */
    input,
    select,
    button {
      width: 100%; /* Ocupa toda a largura disponível */
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
  gap: 20px; /* Espaço entre os cards */
  overflow-x: auto; /* Habilita a rolagem horizontal */
  padding: 10px 0; /* Espaço para destacar os elementos */

  /* Remove a barra de rolagem visível em navegadores suportados */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari e Edge */
  }

  /* Garantindo que os itens tenham tamanho fixo e sejam roláveis */
  > div {
    flex-shrink: 0; /* Evita que os cards encolham */
  }
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 180px;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  min-height: 150px;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const ProductName = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProductPrice = styled.span`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

export default SettingsPage;
