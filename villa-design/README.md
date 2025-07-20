# 🏨 Wega Villa 98 - Premium Villa Management System

A comprehensive villa management and booking platform built with React.js, featuring modern UI/UX design and robust administrative capabilities.

## 🌟 Features

### 🏠 Guest Experience
- **Interactive Homepage**: Stunning hero sections showcasing villa amenities and location
- **Room Booking System**: Easy-to-use room reservation with real-time availability
- **Event Booking**: Special event and occasion booking capabilities
- **Tour Guide Services**: Browse and book professional tour guides
- **Gallery**: Beautiful image galleries showcasing villa facilities and surroundings
- **Client Reviews**: Authentic guest testimonials and rating system
- **Contact Information**: Multiple ways to reach the villa management

### 👥 Administrative Dashboard
- **Role-Based Access Control**: Separate access levels for Admins and Managers
- **Session Management**: Secure 30-minute sessions with automatic timeout and heartbeat monitoring
- **User Management**: Comprehensive user administration and role assignment
- **Booking Management**: View, manage, and track all reservations
- **Room Management**: Add, edit, and manage room inventory and availability
- **Tour Guide Management**: Manage tour guide profiles and availability
- **Analytics Dashboard**: Visual charts and statistics for business insights
- **Settings Panel**: Customizable preferences and account management

### 🔐 Authentication & Security
- **Secure Login System**: JWT-based authentication with role verification
- **Session Management**: Advanced session handling with multi-tab coordination
- **Browser Close Detection**: Automatic logout on browser/tab closure
- **Session Heartbeat**: Keep-alive mechanism for active users
- **Cross-Tab Synchronization**: Synchronized logout across multiple tabs

## 🛠️ Technology Stack

- **Frontend Framework**: React.js 18+
- **Styling**: Tailwind CSS, Custom CSS
- **UI Components**: Lucide React Icons, Custom Components
- **Charts**: Chart.js with React Chart.js 2
- **HTTP Client**: Axios for API communication
- **Build Tool**: Create React App
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router DOM

## 📁 Project Structure

```
villa-design/
├── public/
│   ├── assets/           # Static images and media files
│   └── index.html        # HTML template
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Navbar.jsx    # Navigation component
│   │   ├── Footer.jsx    # Footer component
│   │   └── ClientReview.jsx # Review component
│   ├── pages/            # Main application pages
│   │   ├── Home.jsx      # Landing page
│   │   ├── About.jsx     # About us page
│   │   ├── Contact.jsx   # Contact page
│   │   ├── Auth.jsx      # Login/Authentication
│   │   ├── AdminDashboard.jsx # Admin panel
│   │   ├── GuideDashboard.jsx # Tour guide dashboard
│   │   ├── RoomBooking.jsx    # Room booking interface
│   │   ├── EventBooking.jsx   # Event booking interface
│   │   ├── TourGuidBook.jsx   # Tour guide booking
│   │   ├── gallery.jsx        # Image gallery
│   │   └── travel.jsx         # Travel information
│   ├── utils/            # Utility functions
│   │   ├── api.js        # API communication layer
│   │   └── sessionManager.js # Session management utilities
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
├── build/                # Production build files
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SE01-Industry-Based-Group-Project2025/Wega_villa98.git
   cd Wega_villa98/villa-design
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner
- **`npm run build`** - Builds the app for production
- **`npm run eject`** - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Environment Setup
Configure your environment variables for API endpoints and other settings:

```javascript
// src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is available in `tailwind.config.js`.

## 👤 User Roles & Permissions

### Admin Users
- Full system access
- User management
- Room and booking management
- Tour guide administration
- System settings and analytics

### Manager Users
- Dashboard access
- Booking management
- Room management
- Tour guide management
- Limited administrative functions

### Tour Guides
- Personal dashboard
- Booking management
- Profile updates
- Schedule management

### Guests
- Room booking
- Event booking
- Tour guide booking
- Gallery viewing
- Contact and reviews

## 📊 Session Management

The application features a comprehensive session management system:

- **Session Duration**: 30 minutes with automatic renewal
- **Heartbeat Interval**: 5-minute keep-alive requests
- **Multi-tab Support**: Synchronized logout across browser tabs
- **Browser Close Detection**: Automatic cleanup on window/tab closure
- **Session Events**: Real-time session state management

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Charts**: Real-time data visualization with Chart.js
- **Modern Icons**: Lucide React icons throughout the interface
- **Loading States**: Smooth loading indicators and feedback
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: User-friendly error messages and recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of an industry-based group project for educational purposes.

## 📞 Support

For support and inquiries, please contact the development team through the project repository or use the contact information provided in the application.

---

**Built with ❤️ by the Wega Villa 98 Development Team**
