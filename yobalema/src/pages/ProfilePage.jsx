import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setProfile(response.data.data);
      } catch (error) {
        setProfile(null);
      }
    };

    load();
  }, [id]);

  if (!profile) {
    return <main className="container py-4"><p>Profil introuvable.</p></main>;
  }

  return (
    <main className="container py-4">
      <section className="card p-4 mb-3">
        <h1 className="h4">{profile.firstName} {profile.lastName}</h1>
        <p className="mb-1">Note moyenne: {profile.rating || 0}/5</p>
        <p className="mb-0">{profile.bio || 'Aucune bio pour le moment.'}</p>
      </section>

      <section className="card p-4 mb-3">
        <h2 className="h6">Avis reçus</h2>
        {profile.receivedReviews?.length === 0 && <p className="mb-0">Aucun avis.</p>}
        {profile.receivedReviews?.map((review) => (
          <div key={review.id} className="border-bottom py-2">
            <p className="mb-0">{review.rating}/5 - {review.comment || 'Sans commentaire'}</p>
          </div>
        ))}
      </section>

      <section className="card p-4">
        <h2 className="h6">Trajets publiés</h2>
        {profile.driverRides?.length === 0 && <p className="mb-0">Aucun trajet.</p>}
        {profile.driverRides?.map((ride) => (
          <div key={ride.id} className="border-bottom py-2">
            <p className="mb-0">{ride.departureCity} → {ride.arrivalCity} ({ride.departureDate})</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default ProfilePage;
