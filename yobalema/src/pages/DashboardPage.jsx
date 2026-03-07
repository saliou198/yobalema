import { useEffect, useState } from 'react';
import api from '../api';

const DashboardPage = () => {
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const loadData = async () => {
    try {
      const [ridesRes, bookingsRes] = await Promise.all([
        api.get('/rides/my/rides'),
        api.get('/bookings/my'),
      ]);
      setMyRides(ridesRes.data.data || []);
      setMyBookings(bookingsRes.data.data || []);
    } catch (error) {
      setMyRides([]);
      setMyBookings([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/confirm`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur confirmation');
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur annulation');
    }
  };

  return (
    <main className="container py-4">
      <h1 className="h4 mb-3">Mon dashboard</h1>

      <section className="card p-3 mb-4">
        <h2 className="h6">Mes trajets publiés</h2>
        {myRides.length === 0 && <p className="mb-0">Aucun trajet publié.</p>}
        {myRides.map((ride) => (
          <div key={ride.id} className="border-bottom py-2">
            <p className="mb-1">{ride.departureCity} → {ride.arrivalCity}</p>
            <p className="mb-0 small text-muted">Statut: {ride.status} | Places: {ride.seatsAvailable}/{ride.seats}</p>
          </div>
        ))}
      </section>

      <section className="card p-3">
        <h2 className="h6">Mes réservations</h2>
        {myBookings.length === 0 && <p className="mb-0">Aucune réservation.</p>}
        {myBookings.map((booking) => (
          <div key={booking.id} className="border-bottom py-2 d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <div>
              <p className="mb-1">{booking.ride?.departureCity} → {booking.ride?.arrivalCity}</p>
              <p className="mb-0 small text-muted">Statut: {booking.status}</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-success" onClick={() => confirmBooking(booking.id)}>Confirmer</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => cancelBooking(booking.id)}>Annuler</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default DashboardPage;
