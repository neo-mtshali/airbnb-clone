# Airbnb Clone

A full-stack web application that replicates the core functionality of Airbnb, allowing users to browse property listings, view detailed information about individual properties, and make bookings.

## Features

- Browse property listings with filtering options
- View detailed information about individual properties
- User authentication (register, login)
- Host functionality to list properties
- Booking system

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS for styling
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose for database
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
airbnb-clone/
├── backend/               # Backend server code
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── server.js          # Server entry point
│   └── seed.js            # Database seeding script
├── frontend/              # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── App.js         # Main component
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/airbnb-clone.git
cd airbnb-clone
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/airbnb-clone
PORT=5001
JWT_SECRET=your_jwt_secret_key_here
```

4. Seed the database
```
node seed.js
```

5. Install frontend dependencies
```
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```
cd backend
npm start
```

2. Start the frontend development server
```
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Accommodations
- `GET /api/accommodations` - Get all accommodations
- `GET /api/accommodations/:id` - Get accommodation by ID
- `POST /api/accommodations` - Create a new accommodation (requires authentication)
- `PUT /api/accommodations/:id` - Update an accommodation (requires authentication)
- `DELETE /api/accommodations/:id` - Delete an accommodation (requires authentication)

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get current user profile (requires authentication)

## Future Enhancements

- Implement booking functionality
- Add payment processing
- Enhance search and filtering capabilities
- Add user reviews and ratings
- Implement messaging between hosts and guests
- Add admin dashboard for managing listings and users
