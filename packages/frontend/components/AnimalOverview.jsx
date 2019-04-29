import React from "react";
import ReactDOM from "react-dom";
import css from "./animal-overview.scss";
import { getAnimalPhoto } from "../utils/animal";

export default class AnimalOverview extends React.Component {
  render() {
    const { animals, setSelectedAnimal } = this.props;

    return (
      <ul className={css["animal-overview"]}>
        {animals.map(animal => {
          return (
            <li
              className={css["animal"]}
              key={animal.id}
              onClick={() => {
                setSelectedAnimal(animal);
              }}
            >
              <img className={css["image"]} src={getAnimalPhoto(animal)} />
              <h2 className={css["animal-name"]}>{animal.name}</h2>
            </li>
          );
        })}
      </ul>
    );
  }
}
