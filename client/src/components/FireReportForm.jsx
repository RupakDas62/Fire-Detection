import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FireReportForm() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  // Fetch user's location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to fetch location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert('Location is required to report the fire.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('location', JSON.stringify({
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    })); // GeoJSON format

    if (image) {
      formData.append('image', image); // Append image correctly
    }

    try {
      const response = await axios.post('http://localhost:8080/api/fire-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });
      alert('Fire report sent successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error sending fire report:', error);
      alert('Error sending fire report.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report Fire Incident</h2>

      <textarea
        className='text'
        placeholder="Describe the fire incident"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" disabled={!location}>
        {location ? 'Report Fire' : 'Fetching location...'}
      </button>
    </form>
  );
}

export default FireReportForm;
