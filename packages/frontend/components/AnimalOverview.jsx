import React from "react";
import classNames from "classnames";
import ReactDOM from "react-dom";
import css from "./animal-overview.scss";
import { getAnimalPhoto } from "../utils/animal";

export default class AnimalOverview extends React.Component {
  render() {
    const { animals, selectedAnimal, setSelectedAnimal } = this.props;

    return (
      <ul className={css["animal-overview"]}>
        {animals.map(animal => {
          return (
            <li
              className={css["animal"]}
              key={animal.id}
              onClick={() => {
                if (selectedAnimal && selectedAnimal.id === animal.id) {
                  return setSelectedAnimal(null);
                }

                setSelectedAnimal(animal);
              }}
            >
              <img className={css["image"]} src={getAnimalPhoto(animal)} />
              <h2
                className={classNames(css["animal-name"], {
                  [css["is-selected"]]: selectedAnimal && animal.id === selectedAnimal.id
                })}
              >
                {animal.name}
              </h2>
            </li>
          );
        })}
      </ul>
    );
  }
}
