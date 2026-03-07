import styled from 'styled-components';
import { useState } from 'react';
import  LocationInput from './locationAutocomplete.jsx';



function TripSearch() {

  const [departure, setDepart] = useState(null);
  const [arrival, setArrival] = useState(null);
  const handleSearch = (event) => {
    event.preventDefault();
  };


  return (
    <StyledHome>
      <form className="trip-search" onSubmit={handleSearch}>
        <LocationInput
           label="Lieu de départ"
          onSelect={(place) => setDepart(place)}
        />
        <LocationInput
          label="Lieu d'arrivée"
          onSelect={(place) => setArrival(place)}
        />
        <button type="submit">Rechercher</button>
      </form>
    </StyledHome>
  );
}

const StyledHome = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 16px 24px;

  .trip-search {
    width: min(900px, 100%);
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.14);
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  }

  input {
    height: 46px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 0 12px;
    font-size: 15px;
    outline: none;
  }

  input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  button {
    height: 46px;
    border: none;
    border-radius: 10px;
    padding: 0 18px;
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 760px) {
    .trip-search {
      grid-template-columns: 1fr;
    }
  }
`;

export default TripSearch;
