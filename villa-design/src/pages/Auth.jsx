import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, showApiError, showCustomNotification } from "../utils/api";
import {LogIn,UserPlus,Mail,Lock,User,CheckCircle,AlertCircle,Eye,EyeOff} from "lucide-react";
import Navbar from "../components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Registration form states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [agree, setAgree] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Regex patterns for validation
  const namePattern = /^[a-zA-Z\s'-]{2,50}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validation functions
  const validateField = (field, value) => {
    let error = "";
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = "Name is required";
        } else if (!namePattern.test(value)) {
          error = "Name must be 2-50 characters, letters, spaces, apostrophes, hyphens only";
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = "Email is required";
        } else if (!emailPattern.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      
      case 'password':
        if (!value.trim()) {
          error = "Password is required";
        } else if (!passwordPattern.test(value)) {
          error = "Password must be 8+ characters with uppercase, lowercase, number, and special character";
        }
        break;
      
      case 'confirmPassword':
        if (!value.trim()) {
          error = "Password confirmation is required";
        } else if (value !== registerPassword) {
          error = "Passwords do not match";
        }
        break;
      
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === "";
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'name':
        setRegisterName(value);
        validateField('name', value);
        break;
      
      case 'email':
        setRegisterEmail(value);
        validateField('email', value);
        break;
      
      case 'password':
        setRegisterPassword(value);
        validateField('password', value);
        // Re-validate confirm password if it exists
        if (registerConfirm) {
          validateField('confirmPassword', registerConfirm);
        }
        break;
      
      case 'confirmPassword':
        setRegisterConfirm(value);
        validateField('confirmPassword', value);
        break;
      
      default:
        break;
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    // Validate all fields
    const isNameValid = validateField('name', registerName);
    const isEmailValid = validateField('email', registerEmail);
    const isPasswordValid = validateField('password', registerPassword);
    const isConfirmPasswordValid = validateField('confirmPassword', registerConfirm);    // Check agreement
    if (!agree) {
      setRegisterError("You must agree to the terms & conditions");
      return;
    }

    // Check if all validations pass
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      setRegisterError("Please fix the validation errors above");
      return;
    }

    try {
      console.log('🔄 Registering user...');
      
      const result = await api.post("/api/auth/register", {
        username: registerEmail,
        password: registerPassword,
        fullName: registerName
      });
        if (result.ok) {
        console.log('Registration successful');
        const successMessage = "Registration successful! You can now login.";
        setRegisterSuccess(successMessage);
        showCustomNotification(successMessage, 'success');
        setRegisterError("");
        // Clear form
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirm("");
        setAgree(false);
        // Clear validation errors
        setValidationErrors({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        // Switch to login form after 2 seconds
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);      } else {
        console.error('Registration failed:', result.error);
        setRegisterError(result.error || "Registration failed");
        showApiError(result.error, 'register');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setRegisterError("Network error: Unable to connect to server");
      showApiError("Network error: Unable to connect to server", 'register');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      console.log("Attempting login with email:", loginEmail);
      
      const result = await api.post("/api/auth/login", {
        username: loginEmail,
        password: loginPassword
      });
      
      if (!result.ok) {
        console.error('Login failed:', result.error);
        setLoginError(result.error || "Login failed");
        showApiError(result.error, 'login');
        return;
      }
      
      const data = result.json;
      console.log("Login successful, response:", data);
      
      // Store token
      localStorage.setItem("token", data.token);
      
      // Store user ID if available
      if (data.userId || data.id) {
        localStorage.setItem("userId", data.userId || data.id);
        console.log("Stored user ID:", data.userId || data.id);
      }

      // ===== NEW: SESSION MANAGEMENT =====
      // Handle session management for ADMIN/MANAGER users
      if (data.sessionId && data.sessionManaged) {
        console.log("🔐 Session management enabled for user");
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('sessionManaged', data.sessionManaged);
        console.log("Stored session ID:", data.sessionId);
      } else {
        console.log("ℹ️ No session management for this user");
      }
      
      // Extract and store user role
      let userRole = null;
      
      // First, try to get role from backend response
      if (data.role) {
        userRole = data.role;
        console.log("Role from backend response:", userRole);
      } else {
        // Fallback: try to decode role from JWT token
        try {
          const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
          console.log("JWT token payload:", tokenPayload);
          userRole = tokenPayload.roles || tokenPayload.role || tokenPayload.authorities;
          console.log("Role from JWT:", userRole);
        } catch (jwtError) {
          console.error("Error decoding JWT:", jwtError);
        }
      }
      
      // Store role (handle both string and array formats)
      if (Array.isArray(userRole)) {
        userRole = userRole[0]; // Take first role if array
      }
      localStorage.setItem("userRole", userRole || "USER");
      console.log("Stored user role:", userRole);
      
      // Extract user name - try multiple sources
      let displayName = data.fullName || data.name || data.displayName;
      console.log("Display name from backend:", displayName);
      
      // If no name from backend, try to extract from username/email
      if (!displayName) {
        const username = data.username || loginEmail;
        console.log("No name from backend, using username:", username);
        if (username && username.includes('@')) {
          // Extract name from email (part before @)
          displayName = username.split('@')[0];
        } else {
          displayName = username || "User";
        }
      }        console.log("Final display name to store:", displayName);
      localStorage.setItem("userFullName", displayName);
      localStorage.setItem("username", loginEmail); // Store email as username
      
      // Set flag to indicate successful login (for pending booking restoration)
      localStorage.setItem("justLoggedIn", "true");
      
      // Show success notification
      showCustomNotification(`Welcome back, ${displayName}!`, 'success');
      
      // Trigger custom event to update navbar
      window.dispatchEvent(new CustomEvent('userLogin'));
      // Role-based navigation
      const roleUpper = (userRole || "").toString().toUpperCase();
      console.log("Navigating based on role:", roleUpper);
      
      // ===== NEW: START SESSION MANAGEMENT =====
      // Start session management for ADMIN/MANAGER users
      if (data.sessionId && (roleUpper.includes('ADMIN') || roleUpper.includes('MANAGER'))) {
        console.log("🚀 Starting session management for admin/manager user");
        // Note: The actual session management will be started in the target component (AdminDashboard)
        // This is because we need access to the component's functions and state
      }
      
      if (roleUpper.includes('ADMIN') || roleUpper.includes('MANAGER')) {
        navigate('/admin-dashboard');
      } else if (roleUpper.includes('GUIDE')) {
        navigate('/guide-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Network error");
      showApiError("Network error: Unable to connect to server", 'login');
    }
  };

  return (
    
    <div className="min-h-screen w-full overflow-x-hidden bg-[url('https://png.pngtree.com/background/20211215/original/pngtree-color-block-texture-watercolor-smudge-beige-background-picture-image_1465700.jpg')] bg-cover bg-no-repeat  flex items-center justify-center px-4">
      <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden mt-20">
        <Navbar />
        {/* Side Panel */}
        <div className="absolute w-1/2 h-full bg-[#BF9264] text-white flex flex-col items-center justify-center p-10 z-10 transition-all duration-700">
          {isLogin ? (
            <>
              <UserPlus className="w-10 h-10 mb-3" />
              <h2 className="text-3xl font-bold mb-2">New here?</h2>
              <p className="text-center mb-4">Create your account to join us today!</p>
              <button
                onClick={() => setIsLogin(false)}
                className="bg-white text-amber-900 px-6 py-2 rounded-md font-semibold hover:bg-amber-100 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <LogIn className="w-10 h-10 mb-3" />
              <h2 className="text-3xl font-bold mb-2">Already registered?</h2>
              <p className="text-center mb-4">Log in and continue your journey!</p>
              <button
                onClick={() => setIsLogin(true)}
                className="bg-white text-amber-900 px-6 py-2 rounded-md font-semibold hover:bg-amber-100 transition">
                Login
              </button>
            </>
          )}
        </div>

        {/* Forms Container */}
        <div className="absolute right-0 w-1/2 h-full overflow-hidden flex items-center justify-center">
          {/* Login Form */}
          <div
            className={`absolute w-full px-10 transition-all duration-700 transform ${
              isLogin ? "translate-x-0 opacity-100 z-20" : "translate-x-full opacity-0 z-10"
            }`}
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-bold mb-6 text-amber-900">Login</h3>
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="flex items-center border px-4 py-3 rounded-md">
                  <Mail className="w-5 h-5 mr-3 text-amber-900" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full outline-none"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center border px-4 py-3 rounded-md relative">
                  <Lock className="w-5 h-5 mr-3 text-amber-900" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full outline-none pr-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-amber-900 hover:text-amber-700 focus:outline-none"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                <button type="submit" className="w-full bg-[#BF9264] text-white py-3 rounded-md hover:bg-amber-800 transition">
                  Login
                </button>
              </form>
            </div>
          </div>          {/* Register Form */}
          <div
            className={`absolute w-full px-10 transition-all duration-700 transform ${
              isLogin ? "-translate-x-full opacity-0 z-10" : "translate-x-0 opacity-100 z-20"
            }`}
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-bold mb-6 text-amber-900">Register</h3>
              <form className="space-y-4" onSubmit={handleRegister}>
                {/* Full Name Field */}
                <div>
                  <div className={`flex items-center border px-4 py-3 rounded-md ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <User className="w-5 h-5 mr-3 text-amber-900" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full outline-none" 
                      value={registerName}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                    {registerName && !validationErrors.name && namePattern.test(registerName) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {validationErrors.name && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div className={`flex items-center border px-4 py-3 rounded-md ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Mail className="w-5 h-5 mr-3 text-amber-900" />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full outline-none" 
                      value={registerEmail}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    {registerEmail && !validationErrors.email && emailPattern.test(registerEmail) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {validationErrors.email && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className={`flex items-center border px-4 py-3 rounded-md ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Lock className="w-5 h-5 mr-3 text-amber-900" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      className="w-full outline-none" 
                      value={registerPassword}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-amber-900 hover:text-amber-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {registerPassword && !validationErrors.password && passwordPattern.test(registerPassword) && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                    )}
                    {validationErrors.password && (
                      <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
                    )}
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                  )}
                  {/* Password strength indicator */}
                  {registerPassword && !validationErrors.password && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">Password strength:</div>
                      <div className="flex space-x-1">
                        <div className={`h-1 w-1/4 rounded ${/[a-z]/.test(registerPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(registerPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`h-1 w-1/4 rounded ${/\d/.test(registerPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`h-1 w-1/4 rounded ${/[@$!%*?&]/.test(registerPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className={`flex items-center border px-4 py-3 rounded-md ${
                    validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Lock className="w-5 h-5 mr-3 text-amber-900" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm Password" 
                      className="w-full outline-none" 
                      value={registerConfirm}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="ml-2 text-amber-900 hover:text-amber-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {registerConfirm && !validationErrors.confirmPassword && registerPassword === registerConfirm && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                    )}
                    {validationErrors.confirmPassword && (
                      <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
                    )}
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    className="accent-amber-900" 
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span className="text-amber-900">I agree to the terms & conditions</span>
                </label>

                {/* Error and Success Messages */}
                {registerError && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{registerError}</div>
                )}
                {registerSuccess && (
                  <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{registerSuccess}</div>
                )}

                {/* Register Button */}
                <button 
                  type="submit" 
                  className="w-full bg-[#BF9264] text-white py-3 rounded-md hover:bg-amber-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={
                    !agree || 
                    Object.values(validationErrors).some(error => error !== "") ||
                    !registerName || !registerEmail || !registerPassword || !registerConfirm
                  }
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
