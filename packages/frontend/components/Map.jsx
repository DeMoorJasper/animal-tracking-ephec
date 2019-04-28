import React from "react";
import ReactDOM from "react-dom";
import css from "./map.scss";

import { getAnimalPhoto } from "../utils/animal";
import { generateColor } from "../utils/generateColor";

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

const LAYOUT_MAP = {
  bird: {
    "icon-image": "bird",
    "icon-size": 0.02
  },
  fox: {
    "icon-image": "fox",
    "icon-size": 0.05
  }
};

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

      let animalPointsMap = {};
      for (let point of points) {
        if (!animalPointsMap[point.animal.id]) {
          animalPointsMap[point.animal.id] = [];
        }

        animalPointsMap[point.animal.id].push(point);
      }

      for (let animalId of Object.keys(animalPointsMap)) {
        animalPointsMap[animalId] = animalPointsMap[animalId].sort((a, b) => {
          return a.time - b.time;
        });

        map.addLayer({
          id: `${animalId}-route`,
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: animalPointsMap[animalId].map(point => {
                  return [point.lng, point.lat];
                })
              }
            }
          },
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": generateColor(`${animalId}-route`),
            "line-width": 2
          }
        });

        let lastPoint =
          animalPointsMap[animalId][animalPointsMap[animalId].length - 1];
        let lastPointFeature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lastPoint.lng, lastPoint.lat]
          }
        };

        map.addLayer({
          id: `${animalId}-last-location`,
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [lastPointFeature]
            }
          },
          layout: LAYOUT_MAP[lastPoint.animal.animal_type]
        });
      }
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
