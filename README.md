# Hazard Reporting App - India

A full-stack web application for reporting hazards, weather alerts, and emergency services in India. Built without any database - uses in-memory storage and JSON files for persistence.

## 🚀 Features

- **Authentication**: JWT-based login/signup with bcrypt password hashing
- **Hazard Reporting**: Report various types of hazards with AI verification
- **Interactive Maps**: View hazards on maps using React-Leaflet and OpenStreetMap
- **Weather Integration**: Real-time weather data and alerts using OpenWeatherMap API
- **Emergency Services**: Quick access to India's emergency numbers
- **AI Verification**: Automatic verification of hazard reports
- **Responsive UI**: Modern, mobile-friendly interface with TailwindCSS and Framer Motion

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form handling
- React-Leaflet for maps
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- Joi for validation
- Axios for external API calls
- Helmet for security
- Express Rate Limit for rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hazard-reporting-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Get OpenWeatherMap API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key
   - Add it to your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
This will start both the backend server (port 5000) and frontend (port 3000) concurrently.

### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## 📱 Usage

### Demo Account
Use these credentials to test the application:
- **Email**: admin@hazardapp.com
- **Password**: admin123

### Key Features

1. **Report Hazards**
   - Login to your account
   - Go to "Report Hazard"
   - Select hazard type, severity, and location
   - Add description and submit
   - AI will automatically verify the report

2. **View Map**
   - Access the interactive map
   - See all reported hazards with different markers
   - Filter by type, status, and severity
   - View weather alerts and safe zones

3. **Weather Alerts**
   - Check current weather conditions
   - View weather forecasts
   - Get coastal/marine weather data
   - Receive weather alerts

4. **Emergency Services**
   - Quick access to all India emergency numbers
   - One-click calling on mobile devices
   - Emergency tips and preparedness information

## 🗂 Project Structure

```
hazard-reporting-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/              # In-memory storage
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── package.json
└── package.json           # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hazards
- `GET /api/hazards` - Get all hazards
- `POST /api/hazards` - Create new hazard report
- `GET /api/hazards/:id` - Get hazard by ID
- `GET /api/hazards/user/my-reports` - Get user's reports

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/marine` - Get marine weather data
- `GET /api/weather/alerts` - Get weather alerts
- `GET /api/weather/emergency` - Get emergency numbers

## 🚀 Deployment

### Frontend (Vercel)
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `build`

### Backend (Render/Railway)
1. Deploy to Render:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

2. Deploy to Railway:
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

### Environment Variables for Production
```env
JWT_SECRET=your_production_jwt_secret
OPENWEATHER_API_KEY=your_production_api_key
PORT=5000
NODE_ENV=production
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation with Joi
- CORS configuration
- Helmet for security headers

## 🤖 AI Verification Logic

The app includes AI verification for hazard reports based on:
- **Recency**: Reports must be within 24 hours
- **Location**: Must be within India's boundaries
- **Duplicates**: Prevents duplicate reports from same user
- **Content**: Filters out irrelevant or spam content

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- One-click calling for emergency numbers
- Mobile-optimized maps

## 🆘 Emergency Numbers (India)

- **Police**: 100
- **Fire**: 101
- **Ambulance**: 102
- **Disaster Helpline**: 108
- **Women Helpline**: 1091
- **Child Helpline**: 1098
- **Senior Citizen Helpline**: 14567

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- Real-time notifications
- Push notifications for mobile
- Integration with government APIs
- Machine learning for better verification
- Multi-language support
- Offline mode support
- Advanced analytics dashboard

---

**Built with ❤️ for India's safety and security**