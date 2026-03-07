import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const RideDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [ride, setRide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadRide = async () => {
      try {
        const response = await api.get(`/rides/${id}`);
        setRide(response.data.data);

        if (response.data.data?.driver?.id) {
          const reviewRes = await api.get(`/reviews/user/${response.data.data.driver.id}`);
          setReviews(reviewRes.data.data || []);
        }
      } catch (error) {
        setRide(null);
      }
    };

    loadRide();
  }, [id]);

  const bookRide = async () => {
    if (!ride) return;

    setBookingLoading(true);

    try {
      await api.post('/bookings', { rideId: ride.id, seatsReserved: 1 });
      alert('Réservation créée');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur de réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!ride) {
    return <main className="container py-4"><p>Trajet introuvable.</p></main>;
  }

  return (
    <main className="container py-4">
      <section className="card p-4 mb-4">
        <h1 className="h4">{ride.departureCity} → {ride.arrivalCity}</h1>
        <p className="mb-1">Date: {ride.departureDate}</p>
        <p className="mb-1">Heure: {ride.departureTime?.slice(0, 5)}</p>
        <p className="mb-1">Prix: {ride.price} FCFA</p>
        <p className="mb-1">Places restantes: {ride.seatsAvailable}</p>
        {ride.description && <p className="mb-2">{ride.description}</p>}

        <div className="mt-2">
          <h2 className="h6">Conducteur</h2>
          <p className="mb-1">{ride.driver?.firstName} {ride.driver?.lastName}</p>
          <p className="mb-2">Note: {ride.driver?.rating || 0}/5</p>

          {isAuthenticated && (
            <button className="btn btn-dark" onClick={bookRide} disabled={bookingLoading || ride.seatsAvailable < 1}>
              {bookingLoading ? 'Réservation...' : 'Réserver'}
            </button>
          )}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="h6 mb-3">Avis sur le conducteur</h2>
        {reviews.length === 0 && <p className="mb-0">Aucun avis pour le moment.</p>}
        {reviews.map((review) => (
          <div key={review.id} className="border-bottom pb-2 mb-2">
            <p className="mb-1"><strong>{review.reviewer?.firstName || 'Utilisateur'}</strong> - {review.rating}/5</p>
            <p className="mb-0">{review.comment || 'Sans commentaire'}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default RideDetailsPage;
