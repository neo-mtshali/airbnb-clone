const mongoose = require('mongoose');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample user data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$XFNxG5fMvRjQrJPZgMJALOUfJaRnqnKTjy2nZAtN.PBLuVMmYTTdC', // hashed 'password123'
    isHost: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$10$XFNxG5fMvRjQrJPZgMJALOUfJaRnqnKTjy2nZAtN.PBLuVMmYTTdC', // hashed 'password123'
    isHost: true
  }
];

// Sample accommodation data
const accommodations = [
  {
    title: 'Charming Pottery',
    description: 'Entire rental unit hosted by Megan. Enjoy this beautiful, spacious apartment with modern amenities and stylish decor. Perfect for a comfortable stay in the heart of the city.',
    location: 'Cape Town, South Africa',
    price: 120,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1560185008-a33f5c7b1306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Dedicated workspace', 'TV', 'Free parking', 'Elevator'],
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.92,
    reviews: 13,
    checkIn: '3:00 PM',
    checkOut: '11:00 AM'
  },
  {
    title: 'Luxury Beach Villa',
    description: 'Beautiful beachfront villa with stunning ocean views. Perfect for a relaxing getaway.',
    location: 'Malibu, California',
    price: 350,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5JTIwYmVhY2glMjB2aWxsYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGx1eHVyeSUyMGJlYWNoJTIwdmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    ],
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Free parking', 'Air conditioning', 'Washer', 'Dryer'],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: 'Cozy Mountain Cabin',
    description: 'Rustic cabin nestled in the mountains. Perfect for hiking and enjoying nature.',
    location: 'Aspen, Colorado',
    price: 200,
    images: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnRhaW4lMjBjYWJpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1520984032042-162d526883e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBjYWJpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Free parking', 'Heating'],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: 'Modern Downtown Loft',
    description: 'Stylish loft in the heart of the city. Walking distance to restaurants and attractions.',
    location: 'New York, NY',
    price: 180,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'Dryer', 'Elevator'],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: 'Seaside Cottage',
    description: 'Charming cottage with direct access to the beach. Perfect for a romantic getaway.',
    location: 'Cape Cod, Massachusetts',
    price: 220,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    ],
    amenities: ['WiFi', 'Kitchen', 'Beachfront', 'Free parking', 'Patio'],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: 'Luxury Penthouse',
    description: 'Stunning penthouse with panoramic city views. High-end finishes and amenities.',
    location: 'Miami, Florida',
    price: 400,
    images: [
      'https://images.unsplash.com/photo-1622015663319-e97cf3a4dc0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVudGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Kitchen', 'Air conditioning', 'Washer', 'Dryer', 'Elevator'],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Accommodation.deleteMany({});

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Insert accommodations with user references
    const accommodationsWithHosts = accommodations.map((accommodation, index) => ({
      ...accommodation,
      host: createdUsers[index % createdUsers.length]._id
    }));

    const createdAccommodations = await Accommodation.insertMany(accommodationsWithHosts);
    console.log(`${createdAccommodations.length} accommodations created`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
