import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  type Libraries,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./map.style.css";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries: Libraries = ["places"];

const defaultCenter = { lat: 48.8584, lng: 2.2945 };

export default function MapPicker({ value, onChange = undefined, readOnly = false }) {
  const hasValidCoords = (coords) => (
    coords &&
    Number.isFinite(Number(coords.lat)) &&
    Number.isFinite(Number(coords.lng))
  );

  const toValidMarker = (coords) => {
    if (!hasValidCoords(coords)) return null;

    return {
      lat: Number(coords.lat),
      lng: Number(coords.lng),
    };
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState(toValidMarker(value));
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);

  const getPlacePredictions = (input: string): Promise<any[]> => {
    if (!autocompleteServiceRef.current || !input) return Promise.resolve([]);

    return new Promise<any[]>((resolve, reject) => {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "fr" },
        },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK ||
            status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            resolve(predictions || []);
            return;
          }
          reject(new Error(`Autocomplete error: ${status}`));
        }
      );
    });
  };

  const geocodeRequest = (request: any): Promise<any[]> => {
    if (!geocoderRef.current) return Promise.resolve([]);

    return new Promise<any[]>((resolve, reject) => {
      geocoderRef.current.geocode(request, (results, status) => {
        if (
          status === window.google.maps.GeocoderStatus.OK ||
          status === window.google.maps.GeocoderStatus.ZERO_RESULTS
        ) {
          resolve(results || []);
          return;
        }
        reject(new Error(`Geocoding error: ${status}`));
      });
    });
  };

  // Initialize Geocoder and update marker
  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }

    const nextMarker = toValidMarker(value);
    setMarker(nextMarker);

    if (!nextMarker) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      return;
    }

    // Remove old marker if exists
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new AdvancedMarkerElement if available, fallback to standard Marker
    try {
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: nextMarker,
        });
        markerRef.current = advancedMarker;
      } else {
        const standardMarker = new window.google.maps.Marker({
          map: map,
          position: nextMarker,
        });
        markerRef.current = standardMarker;
      }
    } catch (error) {
      console.warn("Error creating marker, using fallback:", error);
      const standardMarker = new window.google.maps.Marker({
        map: map,
        position: nextMarker,
      });
      markerRef.current = standardMarker;
    }

    if (map) {
      map.panTo(nextMarker);
      map.setZoom(15);
    }
  }, [map, value, isLoaded]);

  // Handle autocomplete suggestions
  useEffect(() => {
    if (!isLoaded || !searchValue || readOnly) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }

    const timer = setTimeout(async () => {
      try {
        const predictions = await getPlacePredictions(searchValue.trim());
        setSuggestions(predictions);
        setShowSuggestions(predictions.length > 0);
      } catch (error) {
        console.error("Error getting autocomplete suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, isLoaded, readOnly]);

  const handleMapClick = (e) => {
    if (readOnly) return;

    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(coords);
    setShowSuggestions(false);
    if (onChange) onChange(coords);
  };

  const handlePlaceSearch = async (e) => {
    if (readOnly || !searchValue) return;

    if (e.key !== "Enter") return;
    e.preventDefault();

    try {
      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }

      const results = await geocodeRequest({
        address: searchValue,
      });

      if (results && results.length > 0) {
        const place = results[0];
        const location = place.geometry.location;

        const coords = {
          lat: location.lat(),
          lng: location.lng(),
        };

        setMarker(coords);
        if (map) {
          map.panTo(coords);
          map.setZoom(15);
        }
        if (onChange) onChange(coords);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching place:", error);
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    setSearchValue(suggestion.description);
    setShowSuggestions(false);

    try {
      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }

      const results = await geocodeRequest(
        suggestion.place_id
          ? { placeId: suggestion.place_id }
          : { address: suggestion.description }
      );

      if (results && results.length > 0) {
        const place = results[0];
        const location = place.geometry.location;

        const coords = {
          lat: location.lat(),
          lng: location.lng(),
        };

        setMarker(coords);
        if (map) {
          map.panTo(coords);
          map.setZoom(15);
        }
        if (onChange) onChange(coords);
      }
    } catch (error) {
      console.error("Error geocoding suggestion:", error);
    }
  };

  useEffect(() => {
    if (readOnly) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      const target = event.target as Node | null;
      if (!target || !searchWrapperRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [readOnly]);

  return isLoaded ? (
    <div className="map-picker">
      {!readOnly && (
        <div className="map-search-wrapper" ref={searchWrapperRef}>
          <input
            ref={searchInputRef}
            type="text"
            className="map-search-input"
            placeholder="Rechercher une adresse..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handlePlaceSearch}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="map-search-suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="map-search-suggestion"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <GoogleMap
        mapContainerClassName="map-canvas"
        center={marker || defaultCenter}
        zoom={12}
        onLoad={setMap}
        onClick={readOnly ? undefined : handleMapClick}
        options={{ gestureHandling: 'greedy' }}
      />
    </div>
  ) : (
    <div>Chargement de la carte...</div>
  );
}