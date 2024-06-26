import { useState, useContext } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import * as C from "./styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ButtonReverse from "../../components/ButtonReverse";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify } = location.state || {};

  const [error, setError] = useState(null);

  const [inputs, setInputs] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(inputs);
      if (verify == "professor") {
        navigate("/materiasP");
      } else if (verify === "aluno") {
        navigate("/materiasA");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data);
    }
  };

  const SolicitarSenha = (e) => {
    e.preventDefault();
    return navigate('/redefinirSenha')
  };

  return (
    <>
      <C.Container>
        <C.Content>
          <C.LabelSignin>Login</C.LabelSignin>
          <C.LabelTitle>Email</C.LabelTitle>
          <Input
            type="email"
            placeholder="Digite o seu E-mail"
            name="email"
            onChange={handleChange}
          />
          <C.LabelTitle>Senha</C.LabelTitle>
          <Input
            type="password"
            placeholder="Digite a sua senha"
            name="senha"
            onChange={handleChange}
          />
          <C.labelError>{error && error}</C.labelError>
          <div
            style={{ display: "flex", gap: "15px", padding: "30px 0px 30px" }}
          >
            <Button Text="Entrar" onClick={handleLogin}></Button>
            <ButtonReverse
              Text="Esqueci a senha"
              onClick={SolicitarSenha}
            ></ButtonReverse>
          </div>
          <C.LabelSignup>
            Não tem uma conta?
            <C.Strong>
              <Link
                to={
                  verify === "professor"
                    ? "/cadastroProfessor"
                    : "/cadastroAluno"
                }
              >
                &nbsp;Registre-se
              </Link>
            </C.Strong>
          </C.LabelSignup>
        </C.Content>
        <C.Image src="image.png" alt="Descrição da imagem" />
      </C.Container>
    </>
  );
};

export default Signin;
