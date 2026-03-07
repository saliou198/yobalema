import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import TripSearchForm from '../tripInputForm';

const HomePage = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const loadRides = async () => {
      try {
        const response = await api.get('/rides?limit=6&page=1');
        setRides(response.data.data.items || []);
      } catch (error) {
        setRides([]);
      }
    };

    loadRides();
  }, []);

  return (
    <main className="container py-4">
      <section className="mb-4">
        <h1 className="h3 mb-3">Trouvez votre covoiturage</h1>
        <TripSearchForm />
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Derniers trajets publiés</h2>
          <Link to="/search" className="btn btn-outline-dark btn-sm">Voir tous</Link>
        </div>

        <div className="row g-3">
          {rides.map((ride) => (
            <div className="col-md-4" key={ride.id}>
              <div className="card h-100">
                <div className="card-body">
                  <p className="mb-1"><strong>{ride.departureCity}</strong> → <strong>{ride.arrivalCity}</strong></p>
                  <p className="mb-1">Date: {ride.departureDate}</p>
                  <p className="mb-1">Heure: {ride.departureTime?.slice(0, 5)}</p>
                  <p className="mb-2">Prix: {ride.price} FCFA</p>
                  <Link className="btn btn-dark btn-sm" to={`/rides/${ride.id}`}>Voir trajet</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
