import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCreate } from "react-icons/io";
import Header from "../../components/header";
import Api from "../../services/api";

import "./styles.css";

interface point {
  id: number;
  city: string;
  image: string;
  image_url: string;
  itemsTitle: string[];
  name: string;
  uf: string;
}

const MyPoints = () => {
  const [userPoints, setUserPoints] = useState<point[]>();

  useEffect(() => {
    let id = localStorage.getItem("@Auth:user_id");

    Api.defaults.headers["user_id"] = id;
  }, []);

  useEffect(() => {
    Api.get("/user_points").then((response) => {
      setUserPoints(response.data);
    });
  }, []);

  return (
    <div className="point-results-wrapper">
      <div id="page-my-points">
        <Header />

        <Link to="/create-point" className="custom-anchor create-point-btn">
          <span>
            <IoMdCreate />
          </span>
          <strong>Cadastre um novo ponto</strong>
        </Link>

        <div className="points-grid">
          {userPoints?.map((point) => (
            <section key={point.id} className="point-el">
              <div className="img-div">
                <img
                  src={point.image_url}
                  alt={point.name}
                ></img>
              </div>

              <h1>{point.name}</h1>

              <h3>{point.itemsTitle.join(", ") + "."}</h3>

              <p>
                {point.city + " - " + point.uf}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPoints;
