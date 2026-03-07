import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: 480 }}>
      <h1 className="h4 mb-3">Connexion</h1>
      <form onSubmit={handleSubmit} className="card p-3">
        <label className="form-label">Email</label>
        <input className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label className="form-label">Mot de passe</label>
        <input className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        {error && <p className="text-danger small">{error}</p>}
        <button className="btn btn-dark" disabled={loading} type="submit">{loading ? 'Connexion...' : 'Se connecter'}</button>
        <p className="small mt-3 mb-0">Pas de compte ? <Link to="/auth/register">Créer un compte</Link></p>
      </form>
    </main>
  );
};

export default LoginPage;
