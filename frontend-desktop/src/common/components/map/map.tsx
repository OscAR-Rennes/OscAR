import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  type Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./map.style.css";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries: Libraries = ["places"];

const defaultCenter = { lat: 48.8584, lng: 2.2945 };

const hasValidCoords = (coords) => (
  coords &&
  Number.isFinite(Number(coords.lat)) &&
  Number.isFinite(Number(coords.lng))
);

export default function MapPicker({ value, onChange = undefined, readOnly = false }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState(value || null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!hasValidCoords(value)) return;

    const nextMarker = {
      lat: Number(value.lat),
      lng: Number(value.lng),
    };

    setMarker(nextMarker);

    if (map) {
      map.panTo(nextMarker);
      map.setZoom(15);
    }
  }, [map, value]);

  const handleMapClick = (e) => {
    if (readOnly) return;

    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(coords);
    if (onChange) onChange(coords);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place?.geometry?.location) return;

    const coords = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMarker(coords);
    setSearchValue(place.formatted_address || place.name || "");
    if (map) {
      map.panTo(coords);
      map.setZoom(15);
    }
    if (onChange) onChange(coords);
  };

  return isLoaded ? (
    <div className="map-picker">
      {!readOnly && (
        <Autocomplete
          onLoad={setAutocomplete}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            className="map-search-input"
            placeholder="Rechercher une adresse..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Autocomplete>
      )}

      <GoogleMap
        mapContainerClassName="map-canvas"
        center={marker || defaultCenter}
        zoom={12}
        onLoad={setMap}
        onClick={handleMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  ) : (
    <div>Chargement de la carte...</div>
  );
}