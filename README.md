# Medicare & Pharmacy System

A comprehensive healthcare platform that integrates doctor appointments and medicine delivery services.

## Features

- 🏥 Location-based Hospital & Doctor Search
- 📅 Doctor Appointment Booking
- 💊 Medicine Ordering with Prescription Upload
- 🚚 Order Tracking
- 💳 Secure Payment Integration
- ⭐ Doctor Ratings & Reviews
- 📱 Medicine Reminders
- 📋 Prescription History

## Tech Stack

- Frontend: React.js with Material UI
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT
- Maps: Google Maps API
- Payments: Stripe
- Deployment: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables:
   - Create .env files in both client and server directories
   - Add necessary API keys and configuration

4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Server (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Deployment

The application is deployed on Vercel and can be accessed at [your-app-url].

## License

ISC
