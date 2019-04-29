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
  constructor(props) {
    super(props);

    this.state = {
      mapLayers: []
    };

    this.map = null;
    this.updating = false;
  }

  updateMapLayers() {
    const { points } = this.props;

    this.updating = true;

    let animalPointsMap = {};
    for (let point of points) {
      if (!animalPointsMap[point.animal.id]) {
        animalPointsMap[point.animal.id] = [];
      }

      animalPointsMap[point.animal.id].push(point);
    }

    let mapLayers = [];
    for (let animalId of Object.keys(animalPointsMap)) {
      animalPointsMap[animalId] = animalPointsMap[animalId].sort((a, b) => {
        return a.time - b.time;
      });

      this.map.addSource(`${animalId}-route`, {
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
      });

      this.map.addLayer({
        id: `${animalId}-route`,
        type: "line",
        source: `${animalId}-route`,
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

      this.map.addSource(`${animalId}-last-location`, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [lastPointFeature]
        }
      });

      this.map.addLayer({
        id: `${animalId}-last-location`,
        type: "symbol",
        source: `${animalId}-last-location`,
        layout: LAYOUT_MAP[lastPoint.animal.animal_type]
      });

      mapLayers.push(`${animalId}-route`);
      mapLayers.push(`${animalId}-last-location`);
    }

    this.setState({ mapLayers: mapLayers }, () => (this.updating = false));
  }

  componentDidMount() {
    if (!mapboxgl) return;
    
    const { lng, lat, zoom } = this.props;

    this.updating = true;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom
    });

    this.map.on("load", async () => {
      const initMapImages = async () => {
        await loadMapImage(this.map, "/static/fox.png", "fox");
        await loadMapImage(this.map, "/static/bird.png", "bird");
      };

      await initMapImages();
      this.updateMapLayers();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.map || prevProps === this.props || this.updating) return;

    for (let layer of this.state.mapLayers) {
      this.map.removeLayer(layer);
      this.map.removeSource(layer);
    }

    this.updateMapLayers();
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
