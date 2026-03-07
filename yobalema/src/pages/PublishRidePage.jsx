import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import LocationAutocomplete from '../locationAutocomplete';

const PublishRidePage = () => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [form, setForm] = useState({
    departureDate: '',
    departureTime: '',
    seats: 1,
    price: 0,
    description: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/rides', {
        departureCity: departure?.name,
        arrivalCity: arrival?.name,
        ...form,
      });

      navigate(`/rides/${response.data.data.id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur de publication');
    }
  };

  return (
    <main className="container py-4">
      <section className="card p-4">
        <h1 className="h4 mb-3">Publier un trajet</h1>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <LocationAutocomplete label="Départ" value={departure?.name || ''} onSelect={setDeparture} />
          </div>
          <div className="col-md-6">
            <LocationAutocomplete label="Arrivée" value={arrival?.name || ''} onSelect={setArrival} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              className="form-control"
              type="date"
              value={form.departureDate}
              onChange={(e) => setForm((prev) => ({ ...prev, departureDate: e.target.value }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Heure</label>
            <input
              className="form-control"
              type="time"
              value={form.departureTime}
              onChange={(e) => setForm((prev) => ({ ...prev, departureTime: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Places</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={form.seats}
              onChange={(e) => setForm((prev) => ({ ...prev, seats: Number(e.target.value) }))}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Prix</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-dark" type="submit">Publier</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default PublishRidePage;
