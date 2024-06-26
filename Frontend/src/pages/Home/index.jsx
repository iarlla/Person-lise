import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import useAuth from "../../hooks/useAuth";
import * as C from "./styles";

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <C.Container>
      <C.Title>Home</C.Title>
      <Button Text="Sair" onClick={() => [logout(), navigate("/")]}>
        Sair
      </Button>
    </C.Container>
  );
};

export default Home;
