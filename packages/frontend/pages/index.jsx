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
      let locations = await axios.get(API_URL + "/location", {
        headers: {
          Accept: "application/json"
        }
      });

      let animals = await axios.get(API_URL + "/animal", {
        headers: {
          Accept: "application/json"
        }
      });

      return { locations: locations.data, animals: animals.data };
    } catch (e) {
      console.error(e);
      console.log(e.response);
      return { locations: null, animals: null };
    }
  }

  render() {
    let { locations, animals } = this.props;

    if (!locations || !animals) return null;

    return (
      <div>
        <Heading>Animals be Trackin'</Heading>
        <AnimalOverview animals={animals} />
        <Map
          lng={locations[0].lng}
          lat={locations[0].lat}
          zoom={10}
          points={locations}
        />
      </div>
    );
  }
}

export default withRouter(Index);
