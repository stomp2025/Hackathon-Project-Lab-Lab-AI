# 🏥 STOMP - Sports Team Cardiac Monitoring Platform

<div align="center">

![STOMP Logo](https://img.shields.io/badge/STOMP-Cardiac%20Monitoring-red?style=for-the-badge&logo=heart&logoColor=white)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)

*A comprehensive cardiac monitoring system designed to keep athletes safe during sports activities through real-time vital sign monitoring and emergency response coordination.*

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🔧 Installation](#-installation) • [☁️ Deployment](#️-deployment)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Technologies](#️-technologies)  
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🔧 Local Development Setup](#-local-development-setup)
- [☁️ Cloud Deployment](#️-cloud-deployment)
- [📱 Mobile App Setup](#-mobile-app-setup)
- [🗂️ Project Structure](#️-project-structure)
- [🎨 Features Implemented](#-features-implemented)
- [📚 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)

---

## 🎯 Overview

**STOMP** (Sports Team Cardiac Monitoring Platform) is a revolutionary health monitoring system designed specifically for sports teams. It provides real-time cardiac monitoring, emergency alert systems, and comprehensive dashboards for different user roles including athletes, coaches, referees, and team members.

### 🚨 Problem Statement
Sudden cardiac events during sports activities pose serious risks to athletes. STOMP addresses this by providing:
- **Real-time monitoring** of vital signs
- **Instant emergency alerts** to coaches and medical staff
- **Role-based dashboards** for different stakeholders
- **Emergency response protocols** with CPR guidance
- **Comprehensive onboarding** for new users

---

## ✨ Features

### 🏃‍♂️ **For Athletes**
- Real-time vital signs monitoring (heart rate, blood pressure, temperature)
- Personal health dashboard
- Privacy controls for health data
- Emergency alert system
- CPR system status monitoring

### 👨‍🏫 **For Coaches**
- Team overview dashboard
- Individual athlete monitoring
- Emergency response protocols
- Simulation training tools
- Incident report management

### 🏁 **For Referees**
- Game monitoring interface
- Emergency protocol access
- Incident documentation
- Real-time athlete status during matches

### 👥 **For Team Members**
- Teammate status awareness
- Emergency response training
- CPR guide access
- Team communication features

### 🎓 **Onboarding System**
- Role-specific tutorial flows
- Interactive step-by-step guidance
- Skip functionality for advanced users
- Progress tracking per user
- First-time user detection

---

## 🛠️ Technologies

### **Frontend (Mobile App)**
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Expo Router** - File-based routing
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API calls

### **Backend (Server)**
- **Python** - Server-side programming
- **Flask/FastAPI** - Web framework
- **SQLite/PostgreSQL** - Database
- **WebSocket** - Real-time communication
- **JWT** - Authentication tokens

### **Development Tools**
- **Metro** - JavaScript bundler
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

### **Cloud Services** (Optional)
- **AWS/Heroku** - Application hosting
- **MongoDB Atlas** - Cloud database
- **Firebase** - Authentication & real-time features
- **Expo Application Services (EAS)** - App building & deployment

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### 1-Minute Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/STOMP-App.git
cd STOMP-App

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Start the backend server
python run_server.py

# In a new terminal, start the frontend
cd ../frontend
npm start
```

---

## 🔧 Local Development Setup

### **Step 1: Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/STOMP-App.git
cd STOMP-App
```

### **Step 2: Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python run_server.py
```

The backend will be running at `http://localhost:5000`

### **Step 3: Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start Expo development server
npm start
```

### **Step 4: Running the Mobile App**

**Option A: Expo Go App (Recommended)**
1. Install Expo Go on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code from the terminal

**Option B: iOS Simulator (Mac only)**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

**Option D: Web Browser**
```bash
npm run web
```

---

## ☁️ Cloud Deployment

### **Backend Deployment (Heroku)**

```bash
cd backend

# Create Procfile
echo "web: python run_server.py" > Procfile

# Login to Heroku
heroku login

# Create Heroku app
heroku create stomp-backend

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a stomp-backend
git push heroku main
```

### **Frontend Deployment (Expo Application Services)**

```bash
cd frontend

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS
eas build:configure

# Build for production
eas build --platform all
```

---

## 🗂️ Project Structure

```
STOMP-App/
├── 📱 frontend/                           # React Native mobile application
│   ├── 📄 app.json                       # Expo configuration
│   ├── 📄 package.json                   # Frontend dependencies
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   ├── 📄 babel.config.js                # Babel configuration
│   ├── 📄 metro.config.js                # Metro bundler config
│   ├── 📄 tailwind.config.js             # TailwindCSS config
│   ├── 📄 global.css                     # Global styles
│   ├── 📄 .gitignore                     # Frontend gitignore
│   │
│   ├── 📂 app/                           # Expo Router file-based routing
│   │   ├── 📄 _layout.tsx                # Root layout component
│   │   ├── 📄 index.tsx                  # App entry point & loader
│   │   ├── 📄 get-started.tsx            # Welcome/onboarding screen
│   │   ├── 📄 emergency.tsx              # Emergency CPR guide
│   │   │
│   │   ├── 📂 (auth)/                    # Authentication flow
│   │   │   ├── 📄 _layout.tsx            # Auth layout
│   │   │   ├── 📄 login.tsx              # Login screen
│   │   │   └── 📄 register.tsx           # Registration screen
│   │   │
│   │   └── 📂 (tabs)/                    # Main app navigation
│   │       ├── 📄 _layout.tsx            # Tab layout with navigation
│   │       ├── 📄 index.tsx              # Default tab redirect
│   │       ├── 📄 dashboard.tsx          # General dashboard
│   │       ├── 📄 profile.tsx            # User profile
│   │       ├── 📄 settings.tsx           # App settings
│   │       │
│   │       ├── 📂 athlete/               # Athlete-specific screens
│   │       │   ├── 📄 _layout.tsx        # Athlete layout
│   │       │   ├── 📄 dashboard.tsx      # Vital signs & health data
│   │       │   └── 📄 privacy-settings.tsx
│   │       │
│   │       ├── 📂 coach/                 # Coach-specific screens
│   │       │   ├── 📄 _layout.tsx        # Coach layout
│   │       │   ├── 📄 dashboard.tsx      # Team overview
│   │       │   ├── 📄 reports.tsx        # Incident reports
│   │       │   ├── 📄 simulations.tsx    # Emergency simulations
│   │       │   └── 📂 athlete/
│   │       │       └── 📄 [id].tsx       # Individual athlete details
│   │       │
│   │       ├── 📂 referee/               # Referee-specific screens
│   │       │   ├── 📄 _layout.tsx        # Referee layout
│   │       │   └── 📄 dashboard.tsx      # Game monitoring
│   │       │
│   │       └── 📂 teammate/              # Teammate-specific screens
│   │           ├── 📄 _layout.tsx        # Teammate layout
│   │           └── 📄 dashboard.tsx      # Team communication
│   │
│   ├── 📂 components/                    # Reusable UI components
│   │   ├── 📄 OnboardingTutorial.tsx     # Role-specific tutorial system
│   │   ├── 📄 CPRGuide.tsx               # Step-by-step CPR instructions
│   │   ├── 📄 NotificationSystem.tsx     # In-app notifications
│   │   ├── 📄 NotificationBell.tsx       # Notification indicator
│   │   ├── 📄 EditScreenInfo.tsx         # Development helper
│   │   ├── 📄 ExternalLink.tsx           # External link handler
│   │   ├── 📄 StyledText.tsx             # Themed text component
│   │   ├── 📄 Themed.tsx                 # Theme-aware components
│   │   ├── 📄 useClientOnlyValue.ts      # Client-side utility
│   │   ├── 📄 useColorScheme.ts          # Theme detection
│   │   └── 📂 __tests__/                 # Component tests
│   │
│   ├── 📂 contexts/                      # React Context providers
│   │   └── 📄 AuthContext.tsx            # Authentication state management
│   │
│   ├── 📂 context/                       # Additional contexts
│   │   └── 📄 WebSocketContext.tsx       # Real-time communication
│   │
│   ├── 📂 constants/                     # App constants & configuration
│   │   └── 📄 Config.ts                  # API URLs & app config
│   │
│   ├── 📂 assets/                        # Static assets
│   │   ├── 📂 images/                    # App icons & images
│   │   └── 📂 fonts/                     # Custom fonts
│   │
│   └── 📂 node_modules/                  # Frontend dependencies
│
├── 🖥️ backend/                            # Python backend server
│   ├── 📄 run_server.py                  # Server entry point
│   ├── 📄 requirements.txt               # Python dependencies
│   ├── 📄 SETUP.md                       # Backend setup guide
│   ├── 📄 stomp.db                       # SQLite database file
│   │
│   ├── 📂 app/                           # Application logic
│   │   ├── 📄 main.py                    # FastAPI application setup
│   │   ├── 📄 database.py                # Database configuration
│   │   ├── 📄 dependencies.py            # Dependency injection
│   │   │
│   │   ├── 📂 api/                       # API route handlers
│   │   │   ├── 📄 auth.py                # Authentication endpoints
│   │   │   ├── 📄 dashboard.py           # Dashboard data endpoints
│   │   │   └── 📄 emergency.py           # Emergency alert endpoints
│   │   │
│   │   ├── 📂 models/                    # Database models
│   │   │   ├── 📄 user.py                # User model
│   │   │   ├── 📄 athlete.py             # Athlete-specific data
│   │   │   └── 📄 emergency.py           # Emergency records
│   │   │
│   │   └── 📂 services/                  # Business logic services
│   │       ├── 📄 auth_service.py        # Authentication logic
│   │       ├── 📄 dashboard_service.py   # Dashboard data processing
│   │       └── 📄 notification_service.py
│   │
│   └── 📂 venv/                          # Python virtual environment
│
├── 📋 README.md                          # Project documentation
├── 🚫 .gitignore                         # Git ignore rules
└── 📄 package.json                       # Root project metadata
```



---

## 🎨 Features Implemented

### ✅ **Authentication System**
- [x] User registration with role selection (athlete, coach, referee, teammate)
- [x] JWT-based authentication
- [x] Secure login/logout functionality
- [x] Role-based access control

### ✅ **Onboarding Tutorial System**
- [x] Role-specific tutorial content for each user type
- [x] Interactive step-by-step guidance with progress indicators
- [x] Skip functionality for advanced users
- [x] One-time display for new users only (not on every login)
- [x] AsyncStorage persistence for completion tracking

### ✅ **Dashboard Systems**
- [x] **Athlete Dashboard**: Vital signs monitoring, CPR system status, emergency contacts
- [x] **Coach Dashboard**: Team overview, athlete monitoring, emergency protocols
- [x] **Referee Dashboard**: Game monitoring, emergency alerts, incident documentation
- [x] **Teammate Dashboard**: Team status, practice schedules, announcements
- [x] Real-time data refresh capabilities
- [x] Responsive design for all screen sizes

### ✅ **Emergency Features**
- [x] Comprehensive CPR guide with step-by-step instructions
- [x] Emergency contact system integration
- [x] Alert notification framework
- [x] Emergency protocol documentation

### ✅ **Technical Infrastructure**
- [x] Full TypeScript implementation for type safety
- [x] Comprehensive error handling and user feedback
- [x] Local data persistence with AsyncStorage
- [x] API integration architecture
- [x] Cross-platform compatibility (iOS, Android, Web)
- [x] Comprehensive .gitignore for secure development

### 🔄 **In Progress**
- [ ] Real-time WebSocket integration for live updates
- [ ] Push notifications for emergency alerts
- [ ] Offline mode support for critical features

### 📅 **Planned Features**
- [ ] Wearable device integration (Apple Watch, Fitbit)
- [ ] AI-powered health predictions and anomaly detection
- [ ] Video calling integration for emergency consultations
- [ ] Multi-language support for international teams

---

## 📚 API Documentation

### **Authentication Endpoints**
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/verify      # Token verification
```

### **Dashboard Endpoints**
```http
GET /api/dashboard/athlete    # Athlete dashboard data
GET /api/dashboard/coach      # Coach dashboard data
GET /api/dashboard/referee    # Referee dashboard data
GET /api/dashboard/teammate   # Teammate dashboard data
```

### **Emergency Endpoints**
```http
POST /api/emergency/alert     # Trigger emergency alert
GET  /api/emergency/contacts  # Get emergency contacts
POST /api/emergency/report    # Submit incident report
```

---

## 🧪 Testing

### **Frontend Testing**
```bash
cd frontend
npm test                # Unit tests
npm run test:e2e        # End-to-End tests
npm run type-check      # TypeScript validation
```

### **Backend Testing**
```bash
cd backend
python -m pytest       # Run all tests
pytest --cov=app       # Run with coverage
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - All inputs sanitized and validated
- **Role-Based Access** - Different permissions for different user roles
- **Data Encryption** - Sensitive data encrypted in transit and at rest
- **Environment Variables** - Secure configuration management
- **HTTPS Enforcement** - Secure communication protocols

---

## 🚀 Performance Optimizations

### **Frontend**
- Component lazy loading for faster initial load
- Image optimization and caching
- Bundle size optimization with tree shaking
- Memory leak prevention with proper cleanup

### **Backend**
- Database query optimization
- Response caching strategies
- Connection pooling for better resource management
- API response compression

---

## 🤝 Contributing
# Francis Uche

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following our code style guidelines
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** with a detailed description

### **Code Style Guidelines**
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages (use conventional commits)
- Add comprehensive tests for new features
- Update documentation for API changes

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/YOUR_USERNAME/STOMP-App/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/YOUR_USERNAME/STOMP-App/discussions)
- 📧 **Email**: support@stomp-app.com
- 📚 **Documentation**: [Wiki](https://github.com/YOUR_USERNAME/STOMP-App/wiki)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Native Community** for the incredible cross-platform framework
- **Expo Team** for the outstanding development tools and platform
- **Medical Professionals** who provided guidance on cardiac monitoring protocols
- **Open Source Community** for the amazing libraries and tools
- **Beta Testers** who helped refine the user experience

---

<div align="center">

**Built with ❤️ for athlete safety and sports team coordination**

[⭐ Star this repo](https://github.com/YOUR_USERNAME/STOMP-App) • [🐛 Report Bug](https://github.com/YOUR_USERNAME/STOMP-App/issues) • [💡 Request Feature](https://github.com/YOUR_USERNAME/STOMP-App/discussions)

---

**STOMP** - *Keeping athletes safe, one heartbeat at a time*

</div>
