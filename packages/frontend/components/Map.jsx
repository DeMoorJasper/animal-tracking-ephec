import React from "react";
import ReactDOM from "react-dom";
import css from "./map.scss";

let mapboxgl = {};
if (typeof window !== "undefined") {
  mapboxgl = require("mapbox-gl");
}

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

export default class ReactMap extends React.Component {
  componentDidMount() {
    if (!mapboxgl) return;

    const { lng, lat, zoom, points } = this.props;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom
    });

    https: map.on("load", function() {
      map.loadImage("/static/fox.png", function(error, image) {
        if (error) throw error;
        map.addImage("fox", image);
        map.addLayer({
          id: "points",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: points.map(point => {
                return {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [point.lng, point.lat]
                  }
                };
              })
            }
          },
          layout: {
            "icon-image": "fox",
            "icon-size": 0.05
          }
        });
      });
    });
  }

  render() {
    if (!mapboxgl) return null;

    const { lng, lat, zoom, points } = this.props;

    return (
      <div className={css["map-container"]}>
        <div ref={el => (this.mapContainer = el)} className={css["map"]} />
      </div>
    );
  }
}
