import { useEffect, useRef, useState } from 'react';

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const LocationAutocomplete = ({ label, value, onSelect, placeholder = 'Entrez une ville ou adresse...' }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const fetchSuggestions = async (text) => {
    if (!API_KEY || text.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
      url.searchParams.set('text', text);
      url.searchParams.set('apiKey', API_KEY);
      url.searchParams.set('lang', 'fr');
      url.searchParams.set('limit', '5');

      const response = await fetch(url.toString());
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const next = event.target.value;
    setQuery(next);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchSuggestions(next);
    }, 300);
  };

  const handleSelect = (feature) => {
    const formatted = feature.properties.formatted;
    const selected = {
      name: formatted,
      lat: feature.properties.lat,
      lng: feature.properties.lon,
    };

    setQuery(formatted);
    setSuggestions([]);
    onSelect(selected);
  };

  return (
    <div className="position-relative w-100">
      <label className="form-label mb-1">{label}</label>
      <input className="form-control" type="text" value={query} onChange={handleChange} placeholder={placeholder} />

      {loading && <div className="small text-muted mt-1">Recherche...</div>}

      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ zIndex: 20, maxHeight: 260, overflowY: 'auto' }}>
          {suggestions.map((feature) => (
            <li
              key={feature.properties.place_id}
              className="list-group-item list-group-item-action"
              role="button"
              onClick={() => handleSelect(feature)}
            >
              {feature.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
