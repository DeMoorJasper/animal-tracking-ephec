import React from "react";
import ReactDOM from "react-dom";
import css from "./animal-overview.scss";
import { getAnimalPhoto } from "../utils/animal";

export default class AnimalOverview extends React.Component {
  render() {
    const { animals } = this.props;

    return (
      <ul className={css["animal-overview"]}>
        {animals.map(animal => {
          return (
            <li className={css["animal"]} key={animal.id}>
              <img className={css["image"]} src={getAnimalPhoto(animal)} />
              <h3 className={css["animal-name"]}>{animal.name}</h3>
            </li>
          );
        })}
      </ul>
    );
  }
}
