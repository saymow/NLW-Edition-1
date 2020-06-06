import React from "react";
import { useHistory, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import logo from "../../assets/logo.svg";

import "./styles.css";

const Header = () => {
  const history = useHistory();

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <header>
      <Link to="my-points">
        <img src={logo} alt="Ecoleta"></img>
      </Link>

      <span onClick={handleLogout}>
        <FiArrowLeft size="20px" />
        Sair
      </span>
    </header>
  );
};

export default Header;
