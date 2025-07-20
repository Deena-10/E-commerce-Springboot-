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

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (!profile) return <p className="loading-text">Profile not available.</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>

        <div className="profile-body">
          {editMode ? (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>

              <div className="button-group">
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
              <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
              <div className="button-group">
                <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
