import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: 520 }}>
      <h1 className="h4 mb-3">Inscription</h1>
      <form onSubmit={handleSubmit} className="card p-3">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Prénom</label>
            <input className="form-control" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nom</label>
            <input className="form-control" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
          </div>
        </div>
        <label className="form-label mt-2">Email</label>
        <input className="form-control" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <label className="form-label mt-2">Téléphone</label>
        <input className="form-control" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
        <label className="form-label mt-2">Mot de passe</label>
        <input className="form-control" type="password" minLength={8} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        {error && <p className="text-danger small mt-2 mb-0">{error}</p>}
        <button className="btn btn-dark mt-3" disabled={loading} type="submit">{loading ? 'Création...' : 'Créer mon compte'}</button>
        <p className="small mt-3 mb-0">Déjà inscrit ? <Link to="/auth/login">Connexion</Link></p>
      </form>
    </main>
  );
};

export default RegisterPage;
