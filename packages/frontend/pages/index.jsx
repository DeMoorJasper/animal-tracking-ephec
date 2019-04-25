import React from "react";
import axios from "axios";
import { withRouter } from "next/router";
import { ENCO_AUTH_TOKEN } from "../constants";
import Map from "../components/Map";
import "./style.scss";

class Index extends React.Component {
  static async getInitialProps({ query }) {
    try {
      let location = await axios.get(
        "https://api.enco.io/seaas/0.0.1/device/1C8779C00000029E/location",
        {
          headers: {
            Authorization: ENCO_AUTH_TOKEN,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      return { location: location.data };
    } catch (e) {
      console.error(e);
      console.log(e.response);
      return { location: null };
    }
  }

  render() {
    let { location } = this.props;

    if (!location) return null;

    console.log({ location });

    return (
      <div>
        <Map
          lng={location.longitude}
          lat={location.latitude}
          zoom={10}
          points={[{ lng: location.longitude, lat: location.latitude }]}
        />
      </div>
    );
  }
}

export default withRouter(Index);
