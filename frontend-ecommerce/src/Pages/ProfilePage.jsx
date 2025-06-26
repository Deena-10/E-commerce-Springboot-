import React, { useEffect, useState } from 'react';
import axios from '../Api/axiosInstance';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  useEffect(() => {
    axios.get('/api/user/profile')
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put('/api/user/profile', formData);
      alert('Profile updated!');
      setProfile(res.data);
      setEditMode(false);
    } catch (err) {
      alert('Update failed');
      console.error(err);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not available.</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>My Profile</h2>

        {editMode ? (
          <>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />

            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
            <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
