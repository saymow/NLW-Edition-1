import React, { useState, ChangeEvent, FormEvent } from "react";
import { useHistory, Link } from "react-router-dom";
import * as Yup from "yup";
import { FiLogIn } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Api from "../../../services/api";

import logo from "./../../../assets/logo.svg";

import "./../styles.css";
import "./styles.css";

interface errorObject {
  [key: string]: string;
}

const Register = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      let schema = Yup.object().shape({
        email: Yup.string()
          .required("Campo email deve ser preenchido.")
          .email("Email inválido.")
          .max(320, "Email muito longo."),
        password: Yup.string()
          .required("Campo email deve ser preenchido.")
          .min(8, "Senha deve possuir pelo menos 8 carácteres.")
          .max(32, "Senha deve ter menos de 32 carácteres.")
          .matches(
            /[A-Z][a-z][\d]/,
            "Senha deve possuir letras maiúsculas, minúsculas e pelo menos um número."
          ),
        confirmPassword: Yup.string()
          .required("Confirmação de senha deve ser preenchida.")
          .oneOf([Yup.ref("password")], "Confirmação de senha inválida."),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });

      handleRegister(formData);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessage: errorObject = {};
        console.log(JSON.stringify(err))

        err.inner.forEach((error) => {
          errorMessage[error.path] = error.message;
        });

        // todo
        Object.keys(errorMessage).forEach((value) => {
          alert(errorMessage[value]);
        });
      }
    }
  }

  async function handleRegister(data: {
    email: string;
    password: string;
  }) {

    Api.post("/register", data).then((response) => {
      let { id } = response.data;

      localStorage.setItem("@Auth:user_id", id);

      history.push("/my-points");
    });
  }

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>

        <Link to="/" className="get_back_home_link">
          <span><IoMdArrowRoundBack size="18px"/></span>
          Voltar para página inicial
        </Link>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
          </div>
          <div className="register-field">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
            />
          </div>
          <div className="register-field">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleInputChange}
            />
          </div>
          <button className="custom-anchor link-button">
            <span>
              <FiLogIn />
            </span>
            <strong>Register</strong>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
