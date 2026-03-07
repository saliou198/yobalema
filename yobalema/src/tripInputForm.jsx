import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationAutocomplete from './locationAutocomplete';

function TripSearchForm() {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (departure?.name) params.set('from', departure.name);
    if (arrival?.name) params.set('to', arrival.name);
    if (date) params.set('date', date);
    if (seats) params.set('seats', String(seats));

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form className="card shadow-sm p-3 p-md-4" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <LocationAutocomplete label="Départ" value={departure?.name || ''} onSelect={setDeparture} />
        </div>
        <div className="col-md-4">
          <LocationAutocomplete label="Arrivée" value={arrival?.name || ''} onSelect={setArrival} />
        </div>
        <div className="col-md-2">
          <label className="form-label mb-1">Date</label>
          <input className="form-control" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="col-md-1">
          <label className="form-label mb-1">Places</label>
          <input
            className="form-control"
            type="number"
            min="1"
            max="8"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
          />
        </div>
        <div className="col-md-1 d-grid">
          <button type="submit" className="btn btn-dark">Rechercher</button>
        </div>
      </div>
    </form>
  );
}

export default TripSearchForm;
