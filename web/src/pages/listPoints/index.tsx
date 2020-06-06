import React, { useEffect, useState } from "react";
import Api from "../../services/api";

import Header from "../../components/header";

//styles pretty all the same as myPoints page
import "../myPoints/styles.css";

interface Data {
  match: {
    params: {
      uf: string;
      city: string;
    };
  };
}

interface Points {
  id: number;
  city: string;
  uf: string;
  name: string;
  image_url: string;
  itemsTitle: string[];
}

const ListPoints: React.FC<Data> = (props) => {
  const { uf, city } = props.match.params;
  const [points, setPoints] = useState<Points[]>();

  useEffect(() => {
    Api.get("points", {
      params: {
        uf,
        city,
        items: [1, 2, 3, 4, 5, 6],
      },
    }).then((response) => {
      let points = response.data;

      setPoints(points);
    });
  }, [uf, city]);

  return (
    <div className="point-results-wrapper">
      <div id="page-my-points">
        <Header />

        <div className="points-grid">
          {points?.map((point) => (
            <section key={point.id} className="point-el">
              <div className="img-div">
                <img src={point.image_url} alt={point.name}></img>
              </div>

              <h1>{point.name}</h1>

              <h3>{point.itemsTitle.join(", ") + "."}</h3>

              <p>{point.city + " - " + point.uf}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPoints;
