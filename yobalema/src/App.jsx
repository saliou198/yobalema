import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './navBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RideDetailsPage from './pages/RideDetailsPage';
import PublishRidePage from './pages/PublishRidePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/rides/:id" element={<RideDetailsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/publish" element={<PublishRidePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
