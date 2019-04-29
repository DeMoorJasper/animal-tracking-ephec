import React from "react";
import axios from "axios";
import { withRouter } from "next/router";
import { API_URL } from "../constants";
import Map from "../components/Map";
import AnimalOverview from "../components/AnimalOverview";
import Heading from "../components/Heading";
import "./style.scss";

class Index extends React.Component {
  static async getInitialProps({ query }) {
    try {
      let locations = (await axios.get(API_URL + "/location", {
        headers: {
          Accept: "application/json"
        }
      })).data;

      let animals = (await axios.get(API_URL + "/animal", {
        headers: {
          Accept: "application/json"
        }
      })).data;

      return {
        locations,
        animals
      };
    } catch (e) {
      console.error(e);
      console.log(e.response);
      return { locations: null, animals: null };
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedAnimal: null
    };

    this.setSelectedAnimal = this.setSelectedAnimal.bind(this);
  }

  setSelectedAnimal(selectedAnimal) {
    this.setState({ selectedAnimal });
  }

  render() {
    let { locations, animals } = this.props;

    if (!locations || !animals) return null;
    let animalsMap = animals.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    return (
      <div>
        <Heading>Animals be Trackin'</Heading>
        <AnimalOverview
          animals={animals}
          setSelectedAnimal={this.setSelectedAnimal}
          selectedAnimal={this.state.selectedAnimal}
        />

        <Map
          lng={locations[0].lng}
          lat={locations[0].lat}
          zoom={10}
          points={locations
            .map(loc => {
              loc.animal = animalsMap[loc.sensor_id];
              return loc;
            })
            .filter(
              loc =>
                !(
                  !loc.animal ||
                  (this.state.selectedAnimal &&
                    loc.animal.id !== this.state.selectedAnimal.id)
                )
            )}
        />
      </div>
    );
  }
}

export default withRouter(Index);
