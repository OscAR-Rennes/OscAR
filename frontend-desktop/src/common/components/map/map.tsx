import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./map.style.css";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;



const defaultCenter = { lat: 48.8584, lng: 2.2945 };

export default function MapPicker({ value, onChange }) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const [marker, setMarker] = useState(value || null);

  const handleMapClick = (e) => {
    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(coords);
    if (onChange) onChange(coords);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerClassName="map-canvas"
      center={marker || defaultCenter}
      zoom={12}
      onClick={handleMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  ) : (
    <div>Chargement de la carte...</div>
  );
}