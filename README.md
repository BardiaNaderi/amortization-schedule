# Loan Amortization Calculator

A full-stack application for calculating loan amortization schedules. The application uses React for the frontend and Node.js/Express for the backend, with real-time prime rate data from the Federal Reserve Economic Data (FRED) API.

## Features

- Calculate loan amortization schedules
- Real-time prime rate data from FRED
- Interactive form with validation
- Detailed payment schedule display
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- FRED API key (get one from https://fred.stlouisfed.org/docs/api/api_key.html)

## Project Structure

my-app-frontend/
├── public/
├── src/
│ ├── components/
│ ├── services/
│ └── types/

my-app-backend/
├── src/
│ ├── controllers/
│ ├── services/
│ ├── types/
│ └── routes/
└── tsconfig.json

## Installation

1. Clone the repository
2. Install dependencies for both frontend and backend: `cd my-app-backend && npm install` and `cd my-app-frontend && npm install`
3. Create a `.env` file in the `my-app-backend` directory with your FRED API key
4. Start the backend server: `cd my-app-backend && npm start`
5. Start the frontend server: `cd my-app-frontend && npm start`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter loan details and click "Calculate" to see the amortization schedule

## API Endpoints
- `POST /api/loan/calculate`: Calculate loan amortization schedule
  - Request body:
    ```json
    {
      "principalAmount": number,
      "amortizationMonths": number,
      "termMonths": number,
      "marginRate": number,
      "startDate": string,
      "interestDays": number
    }
    ```

## Development

- Frontend is built with React, TypeScript, and CSS
- Backend uses Express.js and TypeScript
- Prime rate data is fetched from FRED API
- All dates are handled in UTC to avoid timezone issues

## Environment Variables

Backend (.env):
- `FRED_API_KEY`: Your FRED API key for fetching prime rate data
