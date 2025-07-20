# Session Management Integration Documentation

## Overview
This document explains the session management system that has been integrated into the WegaVilla frontend application.

## Key Features

### 🔐 Automatic Session Management
- **ADMIN** and **MANAGER** users automatically get session management enabled
- **TOUR_GUIDE** and regular users do not have session management
- Sessions expire after **30 minutes** of inactivity
- Automatic heartbeat every **5 minutes** keeps sessions alive

### 🚀 Features Implemented

1. **Login Integration** (`Auth.jsx`)
   - Automatically detects when session management is enabled
   - Stores session ID and management flag in localStorage

2. **API Integration** (`api.js`)
   - All API requests include session ID in `X-Session-Id` header
   - Automatic handling of session expiration errors
   - Redirects to login when session expires

3. **Admin Dashboard** (`AdminDashboard.jsx`)
   - Starts session management on component mount
   - Handles session expiration gracefully
   - Enhanced logout with session cleanup

4. **Session Management Utility** (`sessionManager.js`)
   - Centralized session management functions
   - Heartbeat system to keep sessions alive
   - Multi-tab logout coordination
   - Browser close detection

### 🔄 How It Works

#### Login Process
1. User logs in through Auth component
2. Backend returns session data if user is ADMIN/MANAGER
3. Frontend stores session ID and starts management
4. Heartbeat system begins automatically

#### Session Maintenance
- Heartbeat sent every 5 minutes to `/api/auth/heartbeat`
- Manual heartbeat when tab becomes visible
- Session expires if no activity for 30 minutes

#### Logout Process
1. Sends logout request to `/api/auth/logout` with session ID
2. Clears all localStorage data
3. Notifies other tabs to logout
4. Redirects to login page

#### Browser Close
- Automatically sends logout request using `navigator.sendBeacon()`
- Shows confirmation dialog before closing

### 🎯 Multi-Tab Support

The system handles multiple browser tabs:
- Logout in one tab logs out all tabs
- Session expiration in one tab affects all tabs
- Heartbeat from any tab keeps session alive for all tabs

### 🛡️ Security Features

1. **Automatic Logout on Browser Close**
   - Prevents unauthorized access to abandoned sessions
   - Uses beacon API to ensure logout request is sent

2. **Session Expiration Handling**
   - Graceful handling of expired sessions
   - Automatic redirect to login page
   - Clear error messages to users

3. **Cross-Tab Communication**
   - Uses localStorage events to coordinate between tabs
   - Ensures consistent session state across all tabs

### 📱 User Experience

- **Transparent Operation**: Users don't need to do anything special
- **Clear Notifications**: Users are informed when sessions expire
- **Seamless Integration**: Works with existing login/logout flows
- **No Interruption**: Heartbeat system prevents unexpected logouts during active use

### 🔧 Configuration

The session management system uses these settings:
- **Heartbeat Interval**: 5 minutes (300,000ms)
- **Session Timeout**: 30 minutes (backend controlled)
- **Session ID Storage**: localStorage
- **Cross-tab Communication**: localStorage events

### 🐛 Debugging

Session management includes comprehensive logging:
- Session start/stop events
- Heartbeat success/failure
- Session expiration detection
- Cross-tab communication events

Check browser console for session management logs prefixed with emojis:
- 🔄 Session management events
- 💗 Heartbeat events
- ⏰ Session expiration
- 👋 Logout events
- 🚫 Authentication errors

### 🚀 API Endpoints Used

The session management system communicates with these backend endpoints:
- `POST /api/auth/login` - Enhanced to return session data
- `POST /api/auth/heartbeat` - Keeps sessions alive
- `POST /api/auth/logout` - Clean session termination
- `GET /api/auth/session/status` - Check session validity (optional)

### 📄 Files Modified

1. **`src/pages/Auth.jsx`** - Login integration
2. **`src/pages/AdminDashboard.jsx`** - Dashboard session management
3. **`src/utils/api.js`** - API request headers and error handling
4. **`src/utils/sessionManager.js`** - ✨ **NEW** - Session management utility

### ✅ Benefits

- **Enhanced Security**: Automatic session timeouts and cleanup
- **Better User Experience**: Seamless session management
- **Multi-tab Support**: Consistent behavior across browser tabs
- **Maintainable Code**: Centralized session management logic
- **Debugging Support**: Comprehensive logging for troubleshooting

The session management system is now fully integrated and ready for production use! 🎉
