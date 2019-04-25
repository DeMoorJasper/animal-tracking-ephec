import React from "react";
import ReactDOM from "react-dom";
import css from "./map.scss";

import { getAnimalPhoto } from "../utils/animal";

let mapboxgl = {};
if (typeof window !== "undefined") {
  mapboxgl = require("mapbox-gl");
}

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

async function loadMapImage(map, image, imageName) {
  await new Promise((resolve, reject) => {
    map.loadImage(image, function(error, image) {
      if (error) return reject(error);
      map.addImage(imageName, image);
      resolve();
    });
  });
}

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

    map.on("load", async function() {
      async function initMapImages() {
        await loadMapImage(map, "/static/fox.png", "fox");
        await loadMapImage(map, "/static/bird.png", "bird");
      }


      await initMapImages();

      let foxPoints = points.filter(
        point => point.animal.animal_type === "fox"
      );
      let birdPoints = points.filter(
        point => point.animal.animal_type === "bird"
      );

      console.log({ foxPoints, birdPoints });

      map.addLayer({
        id: "bird-points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: birdPoints.map(point => {
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
          "icon-image": "bird",
          "icon-size": 0.02
        }
      });

      map.addLayer({
        id: "fox-points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: foxPoints.map(point => {
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
