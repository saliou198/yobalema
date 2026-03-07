import { useState } from "react";

const LocationInput = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");         // ce que l'user tape
  const [suggestions, setSuggestions] = useState([]); // résultats de l'API

  const API_KEY = "e9c3966f18484ceeb5c6454a930813fa";

  // Cette fonction est appelée à chaque frappe au clavier
  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    // On attend au moins 3 caractères avant d'appeler l'API
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${API_KEY}&lang=fr&limit=5`
      );
      const data = await response.json();

      // data.features contient le tableau des suggestions
      setSuggestions(data.features);
    } catch (error) {
      alert.error("Erreur Geoapify:", error);
    }
  };

  // Quand l'user clique sur une suggestion
  const handleSelect = (place) => {
    const placeName = place.properties.formatted; // adresse complète
    setQuery(placeName);       // on met l'adresse dans le champ
    setSuggestions([]);        // on ferme la liste
    onSelect(place);           // on remonte le lieu choisi au parent
  };

  return (
    <div style={{ position: "relative" }}>
      <label>{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Entrez une ville ou adresse..."
      />

      {/* On affiche les suggestions seulement s'il y en a */}
      {suggestions.length > 0 && (
        <ul style={{
          position: "absolute",
          background: "white",
          border: "1px solid #ccc",
          listStyle: "none",
          padding: 0,
          margin: 0,
          width: "100%",
          zIndex: 1000
        }}>
          {suggestions.map((place) => (
            <li
              key={place.properties.place_id}
              onClick={() => handleSelect(place)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {place.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;