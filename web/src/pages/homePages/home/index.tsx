import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FiLogIn } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";

import logo from "./../../../assets/logo.svg";

import "./../styles.css";
import "./styles.css";

interface IBGEstate {
  sigla: string;
}

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [uf, setUf] = useState<string>();
  const [city, setCity] = useState<string>();

  const [ufList, setUfList] = useState<string[]>([]);
  const [cityList, setCityList] = useState<string[]>([]);

  const history = useHistory();

  useEffect(() => {
    Axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
      const siglas = response.data.map((estado: IBGEstate) => {
        return estado.sigla
      })

      setUfList(siglas)
    })
  },[])

  useEffect(() => {
    Axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
        let cities = response.data.map((cidade: {nome : string}) => cidade.nome)

        setCityList(cities);
      })
  }, [uf, setCityList])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    let uf = event.target.value;

    setUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    let city = event.target.value;

    setCity(city);
  }

  function submitHandler(event: FormEvent) {
    event.preventDefault();
    if (!uf || !city) return;
    
    history.push(`/list-points/${uf}/${city}`);
  }

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>

          <button
            className="custom-anchor link-button"
            onClick={() => setShowModal(true)}
          >
            <span>
              <FaSearch />
            </span>
            <strong>Pesquise pontos de coleta</strong>
          </button>

          <Link to="/login" className="custom-anchor">
            <span>
              <FiLogIn />
            </span>
            <strong>Efetuar login</strong>
          </Link>
          <Link to="/register">
            <strong>
              Registre-se na Ecoleta para poder cadastrar novos casos!
            </strong>
          </Link>
        </main>
      </div>
      {showModal && (
        <div className="modal-el">
          <div
            className="backdrop-el"
            onClick={() => setShowModal(false)}
          ></div>
          <form className="modalbox-el" onSubmit={submitHandler}>
            <h1 className="filter-title">Pontos de coleta</h1>
            <select className="filter-select" onChange={event => handleSelectUf(event)}>
              <option disabled defaultChecked>Estado</option>
              {ufList.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            <select className="filter-select" onChange={event => handleSelectCity(event)}>
              <option disabled defaultChecked>Cidade</option>
              {cityList.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <button className="custom-anchor link-button filter-btn">
              <span>
                <FaSearch />
              </span>
              <strong>Buscar</strong>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
