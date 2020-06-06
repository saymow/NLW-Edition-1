import React, { useState, ChangeEvent, FormEvent } from "react";
import { useHistory, Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import  * as Yup from "yup";
import Api from "../../../services/api";

import logo from "./../../../assets/logo.svg";

import "./../styles.css";
import "./styles.css";


interface errorObject {
  [key: string]: string
}

interface form {
  emai: string;
  password: string
}

const Login = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  console.log(formData)

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;

    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      let schema = Yup.object().shape({
        email: Yup.string()
          .required("Campo email deve ser preenchido.")
          .email("Formado de email inválido."),
        
        password: Yup.string()
          .required("Campo senha deve ser preenchido.")
          .min(8, "Senha deve conter pelo menos 8 carácteres.")
          .max(32, "Senha não deve passar de 32 carácteres.")
          .matches(/[A-Z][a-z][\d]/, "Senha deve possuir letras maiúsculas, minúsculas e pelo menos um número.")
      })

      await schema.validate(formData, {
        abortEarly: false,
      })

      handleLogin(formData);

    } catch (err) {
      if (err instanceof Yup.ValidationError) { 
        const errorMessage: errorObject = {};


        err.inner.forEach(error => {
          errorMessage[error.name] = error.message;
        })

        console.log(errorMessage)

        //todo
        Object.keys(errorMessage).forEach(value => {
          alert(errorMessage[value])
        })
      }
    }
  }

  async function handleLogin(data: {
    email: string;
    password: string;
  }){
    Api.post("login", data).then(response => {
      let { id } = response.data

      localStorage.setItem("@Auth:user_id", id);

      history.push("my-points");
    })
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
          <button className="custom-anchor link-button">
            <span>
              <FiLogIn />
            </span>
            <strong>Login</strong>
          </button>
        </form>
      </div>
    </div>
  )
}


export default Login;