# Disaster Alert System – Frontend (React + Vite)

Frontend for the Spring Boot REST API: `bhagya-gamage/Disaster-Alert-System`.

## Requirements
- Node.js 20+

## Setup
```bash
npm install
```

## Run
```bash
npm run dev
```

## Configure API base URL
Create a `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Auth
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`

JWT is stored in `localStorage` and added to requests as:
`Authorization: Bearer <token>`

## Map
Uses Leaflet via `react-leaflet`.
Currently supports plotting:
- SOS requests: parses `location` as `"lat, lng"`.
- Shelters: attempts to geocode `address` using Nominatim (OpenStreetMap) in dev.
- Disasters: attempts to geocode `location` string in dev.

> Note: For production you should store explicit lat/lng in the backend to avoid geocoding limits.
