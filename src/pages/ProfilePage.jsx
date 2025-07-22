import React from 'react';
import { useAuth } from '../context/AuthContext';
import Profile from '../components/user/Profile';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-page">
      <Profile />
    </div>
  );
};

export default ProfilePage;