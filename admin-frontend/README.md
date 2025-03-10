# Airbnb Clone Admin Dashboard

This is the admin dashboard for the Airbnb Clone project. It provides an interface for administrators to manage property listings, user accounts, and reservations.

## Features

- **User Authentication**: Secure login with JWT authentication
- **Dashboard**: Overview of listings, reservations, and key metrics
- **Property Management**: Create, view, update, and delete property listings
- **Reservation Management**: View and manage reservations
- **User Management**: View and manage user accounts

## Tech Stack

- **React**: Frontend library for building user interfaces
- **React Router**: For navigation and routing
- **Material UI**: Component library for consistent styling
- **Axios**: For API requests
- **JWT**: For secure authentication
- **React Toastify**: For notifications

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend API running (see main project README)

### Installation

1. Clone the repository
2. Navigate to the admin-frontend directory:
   ```
   cd airbnb-clone/admin-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components for different routes
- `src/services`: API service functions
- `src/utils`: Utility functions and helpers
- `src/assets`: Static assets like images and icons

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs tests

## API Integration

The admin dashboard connects to the backend API at `http://localhost:5000/api`. Make sure the backend server is running before using the admin dashboard.

## Authentication

The admin dashboard uses JWT for authentication. Tokens are stored in localStorage and automatically included in API requests.

## License

This project is part of the Airbnb Clone application and is intended for educational purposes only.

