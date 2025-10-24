const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

app.get('/api/rentals', (req, res) => {
  // Mock data for rentals
  const rentals = [
    {
      id: 1,
      title: 'Cozy Downtown Apartment',
      description: 'Beautiful 2-bedroom apartment in the heart of the city',
      price: 1200,
      location: 'Downtown',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2,
      title: 'Suburban Family Home',
      description: 'Spacious 3-bedroom house with garden',
      price: 1800,
      location: 'Suburbs',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 3,
      title: 'Modern Studio Loft',
      description: 'Contemporary studio with city views',
      price: 900,
      location: 'City Center',
      image: 'https://via.placeholder.com/300x200'
    }
  ];
  
  res.json(rentals);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});