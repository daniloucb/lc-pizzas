import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { handleLogin } from "../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <LoginForm>
        <h2>Login</h2>
        <Label htmlFor="email">E-mail:</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
        />
        <Label htmlFor="password">Senha:</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button
          onClick={(e) => handleLogin(e, { email, password }, navigate, setError)}
        >
          Entrar
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

// Estilos utilizando styled-components

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 0 20px; /* Ensure the content fits on mobile */
`;

const LoginForm = styled.form`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  /* To ensure the form doesn't exceed screen size */
  box-sizing: border-box;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;

  &:hover {
    background-color: #45a049;
  }
`;

export default LoginPage;
