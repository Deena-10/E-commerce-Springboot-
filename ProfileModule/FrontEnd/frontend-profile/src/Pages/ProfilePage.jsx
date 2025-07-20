// src/Pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axiosInstance';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/profile');
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('⚠️ Failed to load profile. Are you logged in?');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!profile) {
    return <p style={{ textAlign: 'center' }}>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneNumber}</p>
        <p><strong>Address:</strong> {profile.address}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
