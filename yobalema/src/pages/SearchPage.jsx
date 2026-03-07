import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [minDriverRating, setMinDriverRating] = useState(params.get('minDriverRating') || '');

  const loadRides = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/rides?${params.toString()}`);
      setRides(response.data.data.items || []);
    } catch (error) {
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, [params]);

  const applyFilters = () => {
    const next = new URLSearchParams(params);

    if (maxPrice) next.set('maxPrice', maxPrice);
    else next.delete('maxPrice');

    if (minDriverRating) next.set('minDriverRating', minDriverRating);
    else next.delete('minDriverRating');

    setParams(next);
  };

  return (
    <main className="container py-4">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="card p-3">
            <h2 className="h6">Filtres</h2>
            <label className="form-label mt-2">Prix max</label>
            <input className="form-control" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" min="0" />
            <label className="form-label mt-3">Note conducteur min</label>
            <input className="form-control" value={minDriverRating} onChange={(e) => setMinDriverRating(e.target.value)} type="number" min="1" max="5" />
            <button className="btn btn-dark mt-3" onClick={applyFilters}>Appliquer</button>
          </div>
        </aside>

        <section className="col-lg-9">
          <h1 className="h4 mb-3">Résultats de recherche</h1>

          {loading && <p>Chargement...</p>}

          <div className="row g-3">
            {rides.map((ride) => (
              <div className="col-12" key={ride.id}>
                <div className="card p-3">
                  <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                    <div>
                      <p className="mb-1"><strong>{ride.departureCity}</strong> → <strong>{ride.arrivalCity}</strong></p>
                      <p className="mb-1">{ride.departureDate} à {ride.departureTime?.slice(0, 5)}</p>
                      <p className="mb-0">Places: {ride.seatsAvailable} | Prix: {ride.price} FCFA</p>
                    </div>
                    <Link to={`/rides/${ride.id}`} className="btn btn-dark btn-sm">Détails</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4 p-3">
            <h2 className="h6">Carte</h2>
            <p className="small text-muted mb-2">Aperçu des points de départ/arrivée (intégration map à enrichir).</p>
            <iframe
              title="map"
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.openstreetmap.org/export/embed.html"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default SearchPage;
