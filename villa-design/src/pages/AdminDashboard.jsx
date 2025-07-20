import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, showApiError, showCustomNotification, debugId, roomAPI } from '../utils/api';
import { 
  startSessionManagement, 
  logoutWithSession, 
  getCurrentSessionId, 
  handleSessionExpiration,
  setupSessionEventListeners,
  stopSessionManagement
} from '../utils/sessionManager';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  User,
  Bell,
  Hotel,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Moon,
  Sun,
  UserX,
  Shield,
  MapPin
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Manager management states
  const [managers, setManagers] = useState([]);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [managerForm, setManagerForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [managerFormErrors, setManagerFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Tour Guide management states
  const [tourGuides, setTourGuides] = useState([]);
  const [showTourGuideForm, setShowTourGuideForm] = useState(false);
  const [editingTourGuide, setEditingTourGuide] = useState(null);
  const [tourGuideForm, setTourGuideForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [tourGuideFormErrors, setTourGuideFormErrors] = useState({});
  const [showTourGuidePassword, setShowTourGuidePassword] = useState(false);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  // Settings states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin User',
    email: 'admin@wegavilla.com',
    role: 'Administrator'
  });

  // Room Management States
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: 'Standard' },
    { id: 2, name: 'Deluxe' },
    { id: 3, name: 'Suite' }
  ]); // Initialize with default types as fallback
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    type: '',
    room_no: '',
    available: true
  });
  const [showNewTypeModal, setShowNewTypeModal] = useState(false);
  const [newTypeForm, setNewTypeForm] = useState({
    name: '',
    description: ''
  });
  
  // Room type management states
  const [showRoomTypeForm, setShowRoomTypeForm] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [roomTypeForm, setRoomTypeForm] = useState({
    name: '',
    description: ''
  });
  const [roomTypeFormErrors, setRoomTypeFormErrors] = useState({});
  
  const [roomFormErrors, setRoomFormErrors] = useState({});
  
  // ===== SESSION MANAGEMENT VARIABLES =====
  let sessionEventCleanup = null;

  // ===== SESSION MANAGEMENT FUNCTIONS =====
  
  // Handle session expiration specific to AdminDashboard
  const handleAdminSessionExpired = () => {
    console.log('⏰ Admin session expired, redirecting to login...');
    
    // Show notification specific to admin
    alert('Your admin session has expired for security. Please log in again.');
    
    // Navigate to auth page
    navigate('/auth');
  };

  // Enhanced logout with session management for AdminDashboard
  const handleLogoutWithAdminSession = async () => {
    const sessionId = getCurrentSessionId();
    
    await logoutWithSession(sessionId, () => {
      // Navigate to auth page after logout
      navigate('/auth');
    });
  };

  useEffect(() => {
    // Get admin info from localStorage
    const userFullName = localStorage.getItem("userFullName");
    const userRole = localStorage.getItem("userRole");
    
    if (userFullName) {
      setAdminInfo({
        name: userFullName,
        email: localStorage.getItem("username") || "user@wegavilla.com",
        role: userRole === 'ADMIN' ? 'Administrator' : userRole === 'MANAGER' ? 'Manager' : userRole
      });    }

    // ===== SESSION MANAGEMENT INITIALIZATION =====
    const sessionId = getCurrentSessionId();
    const sessionManaged = localStorage.getItem('sessionManaged');
    
    // Start session management for ADMIN/MANAGER users if session exists
    if (sessionId && sessionManaged === 'true') {
      startSessionManagement(sessionId, handleAdminSessionExpired);
      console.log('🔄 Session management started for admin dashboard');
    }

    // Setup event listeners for session management
    sessionEventCleanup = setupSessionEventListeners(handleAdminSessionExpired);

    // Load managers when component mounts
    if (hasAdminPrivileges()) {
      loadManagers();
    }

    // Load tour guides when component mounts
    loadTourGuides();

    // Load rooms and room types when component mounts (for managers and admins)
    if (hasManagerOrAdminPrivileges()) {
      console.log('👤 User has manager/admin privileges, loading rooms...');
      loadRooms();
      loadRoomTypes();
    }

    // Cleanup function
    return () => {
      // Clean up session event listeners
      if (sessionEventCleanup) {
        sessionEventCleanup();
      }
      
      // Stop session management
      stopSessionManagement();
    };
  }, []);
  // Check admin privileges (only for admin-specific features)
  const hasAdminPrivileges = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole && userRole.toUpperCase() === 'ADMIN';
  };

  // Check if user has manager or admin privileges (for features accessible to both)
  const hasManagerOrAdminPrivileges = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole && (userRole.toUpperCase() === 'ADMIN' || userRole.toUpperCase() === 'MANAGER');
  };
  // Load managers from backend with improved error handling
  const loadManagers = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Loading managers...');
      
      const result = await api.get('/api/admin/managers');

      if (result.ok) {
        console.log('Managers loaded successfully:', result.json);
        
        // Normalize manager data to ensure consistent ID field
        const managersData = Array.isArray(result.json) ? result.json : [];
        const normalizedManagers = managersData.map(manager => {
          // Log the raw manager data to see the structure
          console.log('Raw manager data:', manager);
          
          // Ensure ID is properly set - try different possible ID fields
          const managerId = manager.id || manager.managerId || manager.userId || manager.ID;
          
          if (!managerId) {
            console.warn('Manager missing ID field:', manager);
          }
          
          return {
            ...manager,
            id: managerId, // Ensure consistent ID field
            name: manager.name || manager.fullName || manager.username || 'Unknown',
            email: manager.email || manager.username || 'No email',
            role: manager.role || 'MANAGER',
            status: manager.status || manager.active ? 'Active' : 'Inactive'
          };
        });
        
        console.log('Normalized managers:', normalizedManagers);
        setManagers(normalizedManagers);
      } else {
        console.error('Failed to load managers:', result.error);
        setError(result.error);
        setManagers([]); // Ensure managers is always an array
        
        // Show user-friendly error message
        showApiError(result.error, 'load managers');
      }
    } catch (error) {
      console.error('Unexpected error loading managers:', error);
      const errorMessage = 'An unexpected error occurred while loading managers';
      setError(errorMessage);
      setManagers([]);
      showApiError(errorMessage, 'load managers');
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);  // Create new manager via API with improved error handling
  const createManager = async (managerData) => {
    try {
      console.log('🔄 Creating manager:', managerData);
      
      const result = await api.post('/api/admin/managers', managerData);
      
      if (result.ok) {
        console.log('Manager created successfully:', result.json);
        await loadManagers(); // Refresh the list
        return { success: true, data: result.json };
      } else {
        console.error('Failed to create manager:', result.error);
        showApiError(result.error, 'create manager');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Unexpected error creating manager:', error);
      const errorMessage = 'An unexpected error occurred while creating manager';
      showApiError(errorMessage, 'create manager');
      return { success: false, error: errorMessage };
    }
  };  // Update manager via API with improved error handling
  const updateManager = async (managerId, managerData) => {
    try {
      // Debug the ID before making the request
      debugId('Update Manager', managerId, { managerData });
      
      // Ensure ID is properly formatted (convert to string for URL)
      const normalizedId = String(managerId);
      console.log('Updating manager ID:', normalizedId, 'Data:', managerData);
      
      const result = await api.put(`/api/admin/managers/${normalizedId}`, managerData);
      
      if (result.ok) {
        console.log('Manager updated successfully:', result.json);
        await loadManagers(); // Refresh the list
        return { success: true, data: result.json };
      } else {
        console.error('Failed to update manager:', result.error);
        showApiError(result.error, 'update manager');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Unexpected error updating manager:', error);
      const errorMessage = 'An unexpected error occurred while updating manager';
      showApiError(errorMessage, 'update manager');
      return { success: false, error: errorMessage };
    }
  };  // Delete manager via API with improved error handling
  const deleteManager = async (managerId) => {
    try {
      // Debug the ID before making the request
      debugId('Delete Manager', managerId);
      
      // Ensure ID is properly formatted (convert to string for URL)
      const normalizedId = String(managerId);
      console.log('🔄 Deleting manager ID:', normalizedId);
      
      const result = await api.delete(`/api/admin/managers/${normalizedId}`);
      
      if (result.ok) {
        console.log('Manager deleted successfully');
        await loadManagers(); // Refresh the list
        return { success: true, data: result.json };
      } else {
        console.error('Failed to delete manager:', result.error);
        showApiError(result.error, 'delete manager');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Unexpected error deleting manager:', error);
      const errorMessage = 'An unexpected error occurred while deleting manager';
      showApiError(errorMessage, 'delete manager');
      return { success: false, error: errorMessage };
    }
  };
  // Validation patterns
  const namePattern = /^[a-zA-Z\s'-]{2,50}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Validation function
  const validateManagerField = (field, value) => {
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
        if (!editingManager && !value.trim()) {
          error = "Password is required";
        } else if (value && !passwordPattern.test(value)) {
          error = "Password must be 8+ characters with uppercase, lowercase, number, and special character";
        }
        break;
      default:
        break;
    }
    
    setManagerFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === "";
  };

  // Handle manager form input changes
  const handleManagerInputChange = (field, value) => {
    setManagerForm(prev => ({
      ...prev,
      [field]: value    }));
    validateManagerField(field, value);
  };
  // Reset manager form
  const resetManagerForm = () => {
    setManagerForm({
      name: '',
      email: '',
      password: ''
    });
    setManagerFormErrors({});
    setEditingManager(null);
    setShowManagerForm(false);
  };// Handle manager form submission with improved error handling
  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasAdminPrivileges()) {
      showApiError("You don't have sufficient privileges to perform this action.", "manage managers");
      return;
    }    // Validate all fields
    const isNameValid = validateManagerField('name', managerForm.name);
    const isEmailValid = validateManagerField('email', managerForm.email);
    const isPasswordValid = editingManager || validateManagerField('password', managerForm.password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {      
      console.log('Validation failed:', {
        name: isNameValid,
        email: isEmailValid,
        password: isPasswordValid
      });
      showCustomNotification('Please fix the validation errors before submitting.', 'warning');
      return;
    }

    setLoading(true);    
    try {
      // Create manager data without phone field
      const managerData = {
        name: managerForm.name,
        email: managerForm.email,
        ...(editingManager ? {} : { password: managerForm.password })
      };

      console.log('Submitting manager data:', managerData);

      let result;
      if (editingManager) {
        result = await updateManager(editingManager.id, managerData);
      } else {
        result = await createManager(managerData);
      }      if (result.success) {
        const successMessage = editingManager ? 'Manager updated successfully!' : 'Manager created successfully!';
        setSuccess(successMessage);
        showCustomNotification(successMessage, 'success');
        resetManagerForm();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = 'An unexpected error occurred during submission';
      setError(errorMessage);
      showApiError(errorMessage, editingManager ? 'update manager' : 'create manager');
    } finally {
      setLoading(false);
    }
  };  
  // Handle edit manager with improved error handling
  const handleEditManager = (manager) => {
    if (!hasAdminPrivileges()) {
      showApiError("You don't have sufficient privileges to perform this action.", "edit managers");
      return;
    }
    
    console.log('Editing manager:', manager);
    console.log('Manager ID:', manager.id, 'Type:', typeof manager.id);
    
    // Validate that manager has a valid ID
    if (!manager.id && manager.id !== 0) {
      console.error('Manager missing ID:', manager);
      showApiError("Manager ID is missing. Please refresh the page and try again.", "edit manager");
      return;
    }
    
    setEditingManager(manager);
    setManagerForm({
      name: manager.name || '',
      email: manager.email || '',
      password: ''
    });
    
    // Clear any existing form errors
    setManagerFormErrors({});
    setShowManagerForm(true);
  };
  // Show confirmation modal
  const showConfirmation = (title, message, onConfirm) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setShowConfirmModal(true);
  };

  // Handle confirmation modal actions
  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    if (confirmAction) {
      confirmAction();
    }
    setConfirmAction(null);
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };
  // Handle delete manager with improved error handling
  const handleDeleteManager = async (managerId) => {
    if (!hasAdminPrivileges()) {
      showApiError("You don't have sufficient privileges to perform this action.", "delete managers");
      return;
    }
      console.log('🗑️ Delete request for manager ID:', managerId, 'Type:', typeof managerId);
    
    // Validate that managerId is valid
    if (!managerId && managerId !== 0) {
      console.error('Invalid manager ID:', managerId);
      showApiError("Invalid manager ID. Please refresh the page and try again.", "delete manager");
      return;
    }
    
    showConfirmation(
      "Delete Manager",
      "Are you sure you want to delete this manager? This action cannot be undone.",
      async () => {
        setLoading(true);
        try {          const result = await deleteManager(managerId);
          if (result.success) {
            const successMessage = 'Manager deleted successfully!';
            setSuccess(successMessage);
            showCustomNotification(successMessage, 'success');
          } else {
            setError(result.error);
          }
        } catch (error) {
          console.error('Delete error:', error);
          const errorMessage = 'An unexpected error occurred while deleting manager';
          setError(errorMessage);
          showApiError(errorMessage, 'delete manager');
        } finally {
          setLoading(false);
        }
      }
    );  };
  // ===== TOUR GUIDE API FUNCTIONS =====
  
  // Create new tour guide via dedicated API endpoint
  const createTourGuide = async (tourGuideData) => {
    try {
      console.log('Creating tour guide:', tourGuideData);
      
      const result = await api.post('/api/admin/tour-guides', tourGuideData);
      
      if (result.ok) {
        console.log('Tour guide created successfully:', result.json);
        await loadTourGuides(); // Refresh the list
        return { success: true, data: result.json };
      } else {
        console.error('Failed to create tour guide:', result.error);
        showApiError(result.error, 'create tour guide');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Unexpected error creating tour guide:', error);
      const errorMessage = 'An unexpected error occurred while creating tour guide';
      showApiError(errorMessage, 'create tour guide');
      return { success: false, error: errorMessage };
    }
  };

  // Update tour guide via dedicated API endpoint
  const updateTourGuide = async (tourGuideId, tourGuideData) => {
    try {
      // Debug the ID before making the request
      debugId('Update Tour Guide', tourGuideId, { tourGuideData });
      
      // Ensure ID is properly formatted (convert to string for URL)
      const normalizedId = String(tourGuideId);
      console.log('Updating tour guide ID:', normalizedId, 'Data:', tourGuideData);
      
      const result = await api.put(`/api/admin/tour-guides/${normalizedId}`, tourGuideData);
      
      if (result.ok) {
        console.log('Tour guide updated successfully:', result.json);
        await loadTourGuides(); // Refresh the list
        return { success: true, data: result.json };
      } else {
        console.error('Failed to update tour guide:', result.error);
        showApiError(result.error, 'update tour guide');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Unexpected error updating tour guide:', error);
      const errorMessage = 'An unexpected error occurred while updating tour guide';
      showApiError(errorMessage, 'update tour guide');
      return { success: false, error: errorMessage };
    }
  };

  // Delete tour guide via dedicated API endpoint
  const deleteTourGuide = async (tourGuideId) => {
    try {
      // Debug the ID before making the request
      debugId('Delete Tour Guide', tourGuideId);
      
      // Ensure ID is properly formatted (convert to string for URL)
      const normalizedId = String(tourGuideId);
      console.log('Deleting tour guide ID:', normalizedId);
      
      const result = await api.delete(`/api/admin/tour-guides/${normalizedId}`);
      
      if (result.ok) {
        console.log('Tour guide deleted successfully');
        await loadTourGuides(); // Refresh the list
        return { success: true, data: result.json };
      } else {
        console.error('Failed to delete tour guide:', result.error);
        showApiError(result.error, 'delete tour guide');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Unexpected error deleting tour guide:', error);
      const errorMessage = 'An unexpected error occurred while deleting tour guide';
      showApiError(errorMessage, 'delete tour guide');
      return { success: false, error: errorMessage };
    }  };

  // ===== TOUR GUIDE MANAGEMENT FUNCTIONS =====
  // Load tour guides from backend (users with TOUR_GUIDE role)
  const loadTourGuides = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading tour guides...');
      
      // Use the same manager API endpoint but filter for TOUR_GUIDE role
      const result = await api.get('/api/admin/tour-guides');      if (result.ok) {
        console.log('Users loaded successfully:', result.json);
        console.log('Raw API response type:', typeof result.json);
        console.log('Raw API response:', JSON.stringify(result.json, null, 2));
        
        // Filter for tour guides only
        const usersData = Array.isArray(result.json) ? result.json : [];
        console.log('All users data:', usersData);
        console.log('Number of users:', usersData.length);
        const tourGuidesData = usersData.filter(user => {
          console.log(`Checking user role: "${user.role}" (type: ${typeof user.role}) for user:`, user);
          // Check for role ID 5 (tour guide) or role string 'TOUR_GUIDE'
          const userRole = user.role;
          const isRoleId5 = userRole === 5 || userRole === '5';
          const isRoleString = (userRole || '').toString().trim().toUpperCase() === 'TOUR_GUIDE';
          const isMatch = isRoleId5 || isRoleString;
          console.log(`Role comparison: role=${userRole}, isRoleId5=${isRoleId5}, isRoleString=${isRoleString}, match=${isMatch}`);
          return isMatch;
        });
        
        console.log('Filtered tour guides:', tourGuidesData);
        
        const normalizedTourGuides = tourGuidesData.map(guide => {
          const guideId = guide.id || guide.managerId || guide.userId || guide.ID;
          
          if (!guideId) {
            console.warn('Tour Guide missing ID field:', guide);
          }
            return {
            ...guide,
            id: guideId,
            name: guide.name || guide.fullName || guide.username || 'Unknown',
            email: guide.email || guide.username || 'No email',
            role: guide.role === 5 || guide.role === '5' ? 'TOUR_GUIDE' : (guide.role || 'TOUR_GUIDE'),
            status: guide.status || (guide.active !== false ? 'Active' : 'Inactive')
          };
        });
        
        console.log('Normalized tour guides:', normalizedTourGuides);
        setTourGuides(normalizedTourGuides);
      } else {
        console.error('Failed to load tour guides:', result.error);
        setError(result.error);
        setTourGuides([]);
      }
    } catch (error) {
      console.error('Unexpected error loading tour guides:', error);
      const errorMessage = 'An unexpected error occurred while loading tour guides';
      setError(errorMessage);
      setTourGuides([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Validation function for tour guides
  const validateTourGuideField = (field, value) => {
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
        if (!editingTourGuide && !value.trim()) {
          error = "Password is required";
        } else if (value && !passwordPattern.test(value)) {
          error = "Password must be 8+ characters with uppercase, lowercase, number, and special character";
        }
        break;
      default:
        break;
    }
    
    setTourGuideFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === "";
  };

  // Handle tour guide form input changes
  const handleTourGuideInputChange = (field, value) => {
    setTourGuideForm(prev => ({
      ...prev,
      [field]: value
    }));
    validateTourGuideField(field, value);
  };

  // Reset tour guide form
  const resetTourGuideForm = () => {
    setTourGuideForm({
      name: '',
      email: '',
      password: ''
    });
    setTourGuideFormErrors({});
    setEditingTourGuide(null);
    setShowTourGuideForm(false);
  };
  // Handle tour guide form submission
  const handleTourGuideSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateTourGuideField('name', tourGuideForm.name);
    const isEmailValid = validateTourGuideField('email', tourGuideForm.email);
    const isPasswordValid = editingTourGuide || validateTourGuideField('password', tourGuideForm.password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      console.log('Tour Guide validation failed:', {
        name: isNameValid,
        email: isEmailValid,
        password: isPasswordValid
      });
      setError('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);    try {      // Create tour guide data - no need to include role since backend handles it
      const tourGuideData = {
        name: tourGuideForm.name,
        email: tourGuideForm.email,
        ...(editingTourGuide ? {} : { password: tourGuideForm.password })
      };      
      console.log('Submitting tour guide data:', tourGuideData);
      console.log('Using dedicated tour guide API endpoint');

      let result;
      if (editingTourGuide) {
        // Update existing tour guide using dedicated API endpoint
        result = await updateTourGuide(editingTourGuide.id, tourGuideData);
      } else {
        // Create new tour guide using dedicated API endpoint  
        result = await createTourGuide(tourGuideData);
      }if (result.success) {
        const successMessage = editingTourGuide ? 'Tour guide updated successfully!' : 'Tour guide created successfully!';
        setSuccess(successMessage);
        console.log('Tour guide operation successful, reloading tour guides...');
        resetTourGuideForm();
        // Reload tour guides list
        await loadTourGuides();
        console.log('Tour guides reloaded after submission');
      } else {
        console.error('Tour guide operation failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('Tour Guide submit error:', error);
      setError('An unexpected error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit tour guide
  const handleEditTourGuide = (tourGuide) => {
    console.log('✏️ Editing tour guide:', tourGuide);
    
    setEditingTourGuide(tourGuide);
    setTourGuideForm({
      name: tourGuide.name || '',
      email: tourGuide.email || '',
      password: ''
    });
    
    // Clear any existing form errors
    setTourGuideFormErrors({});
    setShowTourGuideForm(true);
  };
  // Handle delete tour guide
  const handleDeleteTourGuide = async (tourGuideId) => {
    console.log('🗑️ Delete request for tour guide ID:', tourGuideId);
    
    showConfirmation(
      'Delete Tour Guide',
      'Are you sure you want to delete this tour guide? This action cannot be undone.',
      async () => {        try {
          setLoading(true);
          
          // Use the dedicated tour guide API endpoint
          const result = await deleteTourGuide(tourGuideId);
          
          if (result.success) {
            setSuccess('Tour guide deleted successfully!');
            await loadTourGuides(); // Reload the tour guides list
          } else {
            setError(result.error);
          }
        } catch (error) {
          console.error('Delete tour guide error:', error);
          setError('Failed to delete tour guide');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // ===== END TOUR GUIDE MANAGEMENT FUNCTIONS =====

  // ===== ROOM MANAGEMENT FUNCTIONS =====
  
  // Load rooms from backend
  const loadRooms = async () => {
    try {
      console.log('🔍 Loading rooms...');
      setLoading(true);
      const result = await roomAPI.getAllRooms();
      
      console.log('📦 Raw API result:', result);
      
      if (result.ok && result.json) {
        // Handle the backend response structure: { rooms: [...], total: number }
        const responseData = result.json;
        console.log('📋 Response data:', responseData);
        
        let roomsData = [];
        if (responseData.rooms && Array.isArray(responseData.rooms)) {
          roomsData = responseData.rooms;
        } else if (Array.isArray(responseData)) {
          roomsData = responseData;
        }
        
        setRooms(roomsData);
        console.log('✅ Rooms loaded successfully:', roomsData);
        console.log('📊 Total rooms:', roomsData.length);
      } else {
        console.error('❌ Failed to load rooms:', result.error);
        setRooms([]); // Ensure rooms is always an array
        showApiError(result.error, 'load rooms');
      }
    } catch (error) {
      console.error('Load rooms error:', error);
      setRooms([]); // Ensure rooms is always an array
      showApiError('Failed to load rooms', 'load rooms');
    } finally {
      setLoading(false);
    }
  };

  // Load room types from backend
  const loadRoomTypes = async () => {
    try {
      const result = await roomAPI.getRoomTypes();
      
      if (result.ok && result.json) {
        // Handle the backend response structure: { roomTypes: [...], total: number }
        const responseData = result.json;
        const backendTypes = Array.isArray(responseData.roomTypes) ? responseData.roomTypes : 
                           Array.isArray(responseData) ? responseData : [];
        
        setRoomTypes(backendTypes);
        console.log('Room types loaded from database:', backendTypes);
      } else {
        console.error('Failed to load room types:', result.error);
        setRoomTypes([]); // Empty array if no room types in database
        showApiError(result.error, 'load room types');
      }
    } catch (error) {
      console.error('Load room types error:', error);
      setRoomTypes([]); // Empty array on error
      showApiError('Failed to load room types from database', 'load room types');
    }
  };

  // Handle room form submission
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!roomForm.type.trim()) errors.type = 'Room type is required';
    if (!roomForm.room_no.trim()) errors.room_no = 'Room number is required';
    
    if (Object.keys(errors).length > 0) {
      setRoomFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Room form data:', roomForm);
      console.log('📋 Available room types:', roomTypes);
      
      // Find the room type ID from the selected type name
      const selectedRoomType = Array.isArray(roomTypes) 
        ? roomTypes.find(rt => rt.name === roomForm.type)
        : null;
      
      console.log('🔍 Selected room type:', selectedRoomType);
      
      if (!selectedRoomType) {
        throw new Error(`Room type "${roomForm.type}" not found in available types`);
      }
      
      const roomData = {
        type: roomForm.type,              // Keep the type name for backend processing
        roomTypeId: selectedRoomType.id,  // Also send the ID
        room_no: roomForm.room_no,
        available: roomForm.available
      };

      console.log('🏠 Room data to be sent:', roomData);

      let result;
      if (editingRoom) {
        console.log('📝 Updating room:', editingRoom.id);
        result = await roomAPI.updateRoom(editingRoom.id, roomData);
      } else {
        console.log('➕ Creating new room');
        result = await roomAPI.createRoom(roomData);
      }

      console.log('🔄 API Result:', result);

      if (result.ok) {
        const successMessage = editingRoom ? 'Room updated successfully!' : 'Room created successfully!';
        showCustomNotification(successMessage, 'success');
        resetRoomForm();
        await loadRooms();
      } else {
        console.error('❌ Room operation failed:', result.error);
        showApiError(result.error, editingRoom ? 'update room' : 'create room');
      }
    } catch (error) {
      console.error('Room submit error:', error);
      showApiError('An unexpected error occurred', 'submit room');
    } finally {
      setLoading(false);
    }
  };

  // Reset room form
  const resetRoomForm = () => {
    setRoomForm({
      type: '',
      room_no: '',
      available: true
    });
    setRoomFormErrors({});
    setEditingRoom(null);
    setShowRoomForm(false);
  };

  // Handle edit room
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      type: room.type || '',
      room_no: room.room_no || '',
      available: room.available !== false
    });
    setRoomFormErrors({});
    setShowRoomForm(true);
  };

  // Handle delete room (admin only)
  const handleDeleteRoom = async (roomId) => {
    if (!hasAdminPrivileges()) {
      showApiError("Only administrators can delete rooms.", "delete room");
      return;
    }

    showConfirmation(
      'Delete Room',
      'Are you sure you want to delete this room? This action cannot be undone.',
      async () => {
        setLoading(true);
        try {
          const result = await roomAPI.deleteRoom(roomId);
          
          if (result.ok) {
            showCustomNotification('Room deleted successfully!', 'success');
            await loadRooms();
          } else {
            showApiError(result.error, 'delete room');
          }
        } catch (error) {
          console.error('Delete room error:', error);
          showApiError('Failed to delete room', 'delete room');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Handle new room type creation
  const handleCreateNewType = async () => {
    if (!newTypeForm.name.trim()) {
      showCustomNotification('Please enter a type name', 'warning');
      return;
    }

    // Check if type already exists
    const existingType = roomTypes.find(type => 
      (type.name || type).toLowerCase() === newTypeForm.name.trim().toLowerCase()
    );
    
    if (existingType) {
      showCustomNotification('This room type already exists', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Use the new API endpoint with name and description
      const roomTypeData = {
        name: newTypeForm.name.trim(),
        description: newTypeForm.description.trim()
      };
      
      const result = await roomAPI.createRoomType(roomTypeData);
      
      if (result.ok) {
        showCustomNotification('Room type created successfully!', 'success');
        setNewTypeForm({ name: '', description: '' });
        setShowNewTypeModal(false);
        await loadRoomTypes();
        // Auto-select the new type in the form
        setRoomForm(prev => ({ ...prev, type: newTypeForm.name.trim() }));
      } else {
        console.error('Create room type error:', result.error);
        showCustomNotification(result.error || 'Failed to create room type', 'error');
      }
    } catch (error) {
      console.error('Create room type error:', error);
      showCustomNotification('Failed to create room type. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Room Type Management Functions
  const handleRoomTypeSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!roomTypeForm.name.trim()) errors.name = 'Room type name is required';
    
    if (Object.keys(errors).length > 0) {
      setRoomTypeFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const roomTypeData = {
        name: roomTypeForm.name.trim(),
        description: roomTypeForm.description.trim()
      };

      let result;
      if (editingRoomType) {
        // Update existing room type
        result = await roomAPI.updateRoomType(editingRoomType.id, roomTypeData);
      } else {
        // Create new room type
        result = await roomAPI.createRoomType(roomTypeData);
      }
      
      if (result.ok) {
        showCustomNotification(
          editingRoomType ? 'Room type updated successfully!' : 'Room type created successfully!', 
          'success'
        );
        
        // Reload room types
        await loadRoomTypes();
        resetRoomTypeForm();
      } else {
        console.error('Room type operation failed:', result.error);
        showCustomNotification(result.error || 'Failed to save room type', 'error');
      }
    } catch (error) {
      console.error('Room type operation error:', error);
      showCustomNotification('Failed to save room type. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset room type form
  const resetRoomTypeForm = () => {
    setRoomTypeForm({
      name: '',
      description: ''
    });
    setRoomTypeFormErrors({});
    setEditingRoomType(null);
    setShowRoomTypeForm(false);
  };

  // Handle edit room type
  const handleEditRoomType = (roomType) => {
    setEditingRoomType(roomType);
    setRoomTypeForm({
      name: roomType.name || '',
      description: roomType.description || ''
    });
    setRoomTypeFormErrors({});
    setShowRoomTypeForm(true);
  };

  // Handle delete room type
  const handleDeleteRoomType = (roomTypeId) => {
    showConfirmation(
      'Delete Room Type',
      'Are you sure you want to delete this room type? This action cannot be undone.',
      async () => {
        setLoading(true);
        try {
          const result = await roomAPI.deleteRoomType(roomTypeId);
          
          if (result.ok) {
            showCustomNotification('Room type deleted successfully!', 'success');
            await loadRoomTypes();
          } else {
            console.error('Delete room type failed:', result.error);
            showCustomNotification(result.error || 'Failed to delete room type', 'error');
          }
        } catch (error) {
          console.error('Delete room type error:', error);
          showCustomNotification('Failed to delete room type. Please try again.', 'error');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Toggle room availability
  const toggleRoomAvailability = async (roomId, currentAvailability) => {
    setLoading(true);
    try {
      const result = await roomAPI.updateRoomAvailability(roomId, !currentAvailability);
      
      if (result.ok) {
        showCustomNotification(`Room marked as ${!currentAvailability ? 'available' : 'unavailable'}`, 'success');
        await loadRooms();
      } else {
        showApiError(result.error, 'update room availability');
      }
    } catch (error) {
      console.error('Toggle room availability error:', error);
      showApiError('Failed to update room availability', 'update room availability');
    } finally {
      setLoading(false);
    }
  };

  // Load rooms and room types when component mounts or activeTab changes to rooms
  useEffect(() => {
    if (activeTab === 'rooms' && hasManagerOrAdminPrivileges()) {
      loadRooms();
      loadRoomTypes();
    }
  }, [activeTab]);

  // ===== END ROOM MANAGEMENT FUNCTIONS =====

  // Logout handler with session management
  const handleLogout = () => {
    const sessionId = getCurrentSessionId();
    
    if (sessionId) {
      // Use enhanced logout with session management
      handleLogoutWithAdminSession();
    } else {
      // Fallback to simple logout for users without session management
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      navigate('/auth');
    }
  };

  // Sample data for charts
  const bookingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Bookings',
        data: [12, 19, 8, 15, 22, 18],
        backgroundColor: 'rgba(191, 146, 100, 0.8)',
        borderColor: 'rgba(191, 146, 100, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 19000, 8000, 15000, 22000, 18000],
        borderColor: 'rgba(191, 146, 100, 1)',
        backgroundColor: 'rgba(191, 146, 100, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const roomOccupancyData = {
    labels: ['Occupied', 'Available', 'Maintenance'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(191, 146, 100, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
    { id: 'managers', label: 'Managers', icon: Users, roles: ['ADMIN'] },
    { id: 'tourguides', label: 'Tour Guides', icon: MapPin, roles: ['ADMIN', 'MANAGER'] },
    { id: 'bookings', label: 'Bookings', icon: Calendar, roles: ['ADMIN', 'MANAGER'] },
    { id: 'rooms', label: 'Rooms', icon: Hotel, roles: ['ADMIN', 'MANAGER'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'MANAGER'] },
  ];

  // Filter menu items based on user role
  const getCurrentUserRole = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole ? userRole.toUpperCase() : 'USER';
  };

  const getFilteredMenuItems = () => {
    const userRole = getCurrentUserRole();
    return menuItems.filter(item => item.roles.includes(userRole));
  };

  const filteredMenuItems = getFilteredMenuItems();

  const stats = [
    { label: 'Total Bookings', value: '94', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Users', value: '1,234', icon: Users, color: 'bg-green-500' },
    { label: 'Revenue', value: '$94,000', icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Available Rooms', value: '25', icon: Hotel, color: 'bg-purple-500' },
  ];

  // Ensure managers can't access restricted tabs
  useEffect(() => {
    const userRole = getCurrentUserRole();
    const allowedTabs = filteredMenuItems.map(item => item.id);
    
    if (!allowedTabs.includes(activeTab)) {
      console.log(`User ${userRole} attempted to access restricted tab: ${activeTab}`);
      setActiveTab('dashboard'); // Redirect to dashboard
      showCustomNotification(`Access denied: You don't have permission to access ${activeTab}.`, 'warning');
    }
  }, [activeTab, filteredMenuItems]);

  // Settings functionality
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can store this preference in localStorage
    localStorage.setItem('darkMode', (!isDarkMode).toString());
    showCustomNotification(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`, 'success');
  };

  // Load dark mode preference
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference) {
      setIsDarkMode(darkModePreference === 'true');
    }
  }, []);

  // Password validation for settings
  const validatePasswordField = (field, value) => {
    let error = "";
    
    switch (field) {
      case 'currentPassword':
        if (!value.trim()) {
          error = "Current password is required";
        }
        break;
      case 'newPassword':
        if (!value.trim()) {
          error = "New password is required";
        } else if (!passwordPattern.test(value)) {
          error = "Password must be 8+ characters with uppercase, lowercase, number, and special character";
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = "Password confirmation is required";
        } else if (value !== passwordForm.newPassword) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    
    setPasswordErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === "";
  };

  // Handle password form changes
  const handlePasswordInputChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    validatePasswordField(field, value);
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isCurrentValid = validatePasswordField('currentPassword', passwordForm.currentPassword);
    const isNewValid = validatePasswordField('newPassword', passwordForm.newPassword);
    const isConfirmValid = validatePasswordField('confirmPassword', passwordForm.confirmPassword);

    if (!isCurrentValid || !isNewValid || !isConfirmValid) {
      showCustomNotification('Please fix the validation errors before submitting.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await api.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (result.ok) {
        showCustomNotification('Password changed successfully!', 'success');
        setShowChangePasswordModal(false);
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
      } else {
        showApiError(result.error, 'change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      showApiError('Network error: Unable to connect to server', 'change password');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    showConfirmation(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.",
      async () => {
        setLoading(true);
        try {
          const result = await api.delete('/api/auth/delete-account');
          
          if (result.ok) {
            showCustomNotification('Account deleted successfully. You will be logged out.', 'success');
            // Clear all data and redirect to login
            localStorage.clear();
            setTimeout(() => {
              navigate('/auth');
            }, 2000);
          } else {
            showApiError(result.error, 'delete account');
          }
        } catch (error) {
          console.error('Delete account error:', error);
          showApiError('Network error: Unable to connect to server', 'delete account');
        } finally {
          setLoading(false);
        }
      }
    );
  };
  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-64 shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <h1 className="text-2xl font-bold text-[#BF9264]">Wega Villa</h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {getCurrentUserRole() === 'ADMIN' ? 'Admin Dashboard' : 'Manager Dashboard'}
          </p>
        </div>
          <nav className="mt-6">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#BF9264] text-white' 
                    : isDarkMode 
                      ? 'text-slate-300 hover:bg-slate-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">        
        {/* Top Bar */}
        <header className={`shadow-sm border-b px-6 py-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">            <div className="flex items-center space-x-4">
              <h2 className={`text-2xl font-semibold capitalize ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                {activeTab}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">              
              <button className={`p-2 rounded-lg relative ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="relative group">                
                <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-8 h-8 bg-[#BF9264] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{adminInfo.name}</span>
                </div>
                
                {/* Hover dropdown */}
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                  isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-4 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{adminInfo.name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{adminInfo.email}</p>
                    <p className="text-xs text-[#BF9264]">{adminInfo.role}</p>
                  </div>
                  <div className="p-2">
                    <button className={`w-full text-left px-3 py-2 rounded flex items-center space-x-2 ${
                      isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}>
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-3 py-2 rounded flex items-center space-x-2 text-red-500 ${
                        isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;                  return (
                    <div key={index} className={`p-6 rounded-lg shadow-sm border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Monthly Bookings</h3>
                  <Bar data={bookingData} options={{ responsive: true }} />
                </div>
                  <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Revenue Trend</h3>
                  <Line data={revenueData} options={{ responsive: true }} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Room Occupancy</h3>
                  <Doughnut data={roomOccupancyData} options={{ responsive: true }} />
                </div>
                
                <div className={`lg:col-span-2 p-6 rounded-lg shadow-sm border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Recent Activities</h3>
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 p-3 rounded ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                    }`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-800'}`}>New booking from John Doe</span>
                      <span className={`text-xs ml-auto ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>2 min ago</span>
                    </div>
                    <div className={`flex items-center space-x-3 p-3 rounded ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                    }`}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-800'}`}>User Jane Smith registered</span>
                      <span className={`text-xs ml-auto ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>5 min ago</span>
                    </div>
                    <div className={`flex items-center space-x-3 p-3 rounded ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                    }`}>
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-800'}`}>Room 205 maintenance completed</span>
                      <span className={`text-xs ml-auto ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}          {activeTab === 'managers' && (
            <div className="space-y-6">
              {!hasAdminPrivileges() ? (
                <div className={`border rounded-lg p-4 ${
                  isDarkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                }`}>                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Access Denied - You don't have sufficient privileges to manage managers.</span>
                  </div>
                </div>
              ) : (
                <>                  {/* Header with Add Manager Button */}
                  <div className="flex justify-between items-center">
                    <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Manager Management</h3>
                    <button
                      onClick={() => setShowManagerForm(true)}
                      className="bg-[#BF9264] hover:bg-amber-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Manager</span>
                    </button>
                  </div>

                  {/* Error and Success Messages */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-700">{success}</span>
                      </div>
                    </div>
                  )}

                  {/* Manager Registration/Edit Form */}
                  {showManagerForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-semibold">
                            {editingManager ? 'Edit Manager' : 'Add New Manager'}
                          </h4>
                          <button
                            onClick={resetManagerForm}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleManagerSubmit} className="space-y-4">
                          {/* Name Field */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <div className={`relative border rounded-md ${
                              managerFormErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}>
                              <input
                                type="text"
                                value={managerForm.name}
                                onChange={(e) => handleManagerInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 pr-10 outline-none rounded-md"
                                placeholder="Enter full name"
                              />
                              {managerForm.name && !managerFormErrors.name && namePattern.test(managerForm.name) && (
                                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                              )}
                              {managerFormErrors.name && (
                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                              )}
                            </div>
                            {managerFormErrors.name && (
                              <p className="text-red-500 text-xs mt-1">{managerFormErrors.name}</p>
                            )}
                          </div>

                          {/* Email Field */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <div className={`relative border rounded-md ${
                              managerFormErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}>
                              <input
                                type="email"
                                value={managerForm.email}
                                onChange={(e) => handleManagerInputChange('email', e.target.value)}
                                className="w-full px-3 py-2 pr-10 outline-none rounded-md"
                                placeholder="Enter email address"
                              />
                              {managerForm.email && !managerFormErrors.email && emailPattern.test(managerForm.email) && (
                                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                              )}
                              {managerFormErrors.email && (
                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                              )}
                            </div>
                            {managerFormErrors.email && (
                              <p className="text-red-500 text-xs mt-1">{managerFormErrors.email}</p>
                            )}                          </div>

                          {/* Password Field - Only show for new managers */}
                          {!editingManager && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                              </label>
                              <div className={`relative border rounded-md ${
                                managerFormErrors.password ? 'border-red-500' : 'border-gray-300'
                              }`}>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={managerForm.password}
                                  onChange={(e) => handleManagerInputChange('password', e.target.value)}
                                  className="w-full px-3 py-2 pr-16 outline-none rounded-md"
                                  placeholder="Enter password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                {managerForm.password && !managerFormErrors.password && passwordPattern.test(managerForm.password) && (
                                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                                )}
                                {managerFormErrors.password && (
                                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                                )}
                              </div>
                              {managerFormErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{managerFormErrors.password}</p>
                              )}
                            </div>
                          )}                          
                          {/* Form Buttons */}
                          <div className="flex space-x-3 pt-4">
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 bg-[#BF9264] hover:bg-amber-800 text-white py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {loading ? 'Processing...' : (editingManager ? 'Update Manager' : 'Add Manager')}
                            </button>
                            <button
                              type="button"
                              onClick={resetManagerForm}
                              disabled={loading}
                              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}                  
                  {/* Managers List */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Current Managers</h4>
                      {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BF9264]"></div>
                          <span className="ml-2 text-gray-600">Loading managers...</span>
                        </div>
                      ) : managers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No managers found. Add your first manager!</p>
                      ) : (
                        <div className="overflow-x-auto">                          
                        <table className="w-full table-auto">
                            <thead>
                              <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>ID</th>
                                <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name</th>
                                <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email</th>
                                <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {managers.map((manager, index) => {
                                // Log each manager for debugging
                                console.log(`🔍 Manager ${index}:`, manager);
                                console.log(`📋 Manager ID: ${manager.id} (${typeof manager.id})`);
                                
                                return (
                                <tr key={manager.id || index} className="border-b hover:bg-gray-50">
                                  <td className="py-3 px-4 text-xs font-mono">
                                    {manager.id || 'NO_ID'} ({typeof manager.id})
                                  </td>
                                  <td className="py-3 px-4">{manager.name}</td>
                                  <td className="py-3 px-4">{manager.email}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditManager(manager)}
                                        disabled={loading}
                                        className="text-blue-600 hover:text-blue-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Edit Manager"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteManager(manager.id)}
                                        disabled={loading}
                                        className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete Manager"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                );
                              })}
                            </tbody>
                          </table>                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}{activeTab === 'tourguides' && (
            <div className="space-y-6">              <div className="flex justify-between items-center">
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Tour Guide Management</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={loadTourGuides}
                    disabled={loading}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                    title="Refresh tour guides list"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setShowTourGuideForm(true)}
                    className="bg-[#BF9264] hover:bg-amber-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Tour Guide</span>
                  </button>
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className={`border rounded-lg p-4 ${
                  isDarkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className={`border rounded-lg p-4 ${
                  isDarkMode ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">{success}</span>
                  </div>
                </div>
              )}

              {/* Tour Guides List */}              
              <div className={`rounded-lg shadow-sm border p-6 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Current Tour Guides ({tourGuides.length})
                  </h4>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BF9264]"></div>
                    <span className={`ml-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Loading tour guides...</span>
                  </div>
                ) : tourGuides.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    No tour guides found. Add your first tour guide!
                  </p>
                ) : (                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                          <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>ID</th>
                          <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name</th>
                          <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email</th>
                          <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tourGuides.map((guide) => {
                          console.log(`Tour Guide:`, guide);
                          console.log(`Tour Guide ID: ${guide.id} (${typeof guide.id})`);
                          
                          return (
                            <tr key={guide.id} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                              <td className={`py-3 px-4 text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                {guide.id || 'NO_ID'} ({typeof guide.id})
                              </td>
                              <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{guide.name}</td>
                              <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{guide.email}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditTourGuide(guide)}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Edit Tour Guide"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTourGuide(guide.id)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete Tour Guide"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Tour Guide Form Modal */}
              {showTourGuideForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">                  <div className={`rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                        {editingTourGuide ? 'Edit Tour Guide' : 'Add New Tour Guide'}
                      </h4>
                      <button
                        onClick={resetTourGuideForm}
                        className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleTourGuideSubmit} className="space-y-4">
                      {/* Name Field */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Full Name
                        </label>
                        <div className={`relative border rounded-md ${
                          tourGuideFormErrors.name ? 'border-red-500' : isDarkMode ? 'border-slate-600' : 'border-gray-300'
                        }`}>
                          <input
                            type="text"
                            value={tourGuideForm.name}
                            onChange={(e) => handleTourGuideInputChange('name', e.target.value)}
                            className={`w-full px-3 py-2 pr-10 outline-none rounded-md ${
                              isDarkMode 
                                ? 'bg-slate-700 text-slate-200 placeholder-slate-400' 
                                : 'bg-white text-gray-900 placeholder-gray-500'
                            }`}
                            placeholder="Enter full name"
                          />
                          {tourGuideForm.name && !tourGuideFormErrors.name && namePattern.test(tourGuideForm.name) && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                          {tourGuideFormErrors.name && (
                            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                          )}
                        </div>
                        {tourGuideFormErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{tourGuideFormErrors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Email Address
                        </label>
                        <div className={`relative border rounded-md ${
                          tourGuideFormErrors.email ? 'border-red-500' : isDarkMode ? 'border-slate-600' : 'border-gray-300'
                        }`}>
                          <input
                            type="email"
                            value={tourGuideForm.email}
                            onChange={(e) => handleTourGuideInputChange('email', e.target.value)}
                            className={`w-full px-3 py-2 pr-10 outline-none rounded-md ${
                              isDarkMode 
                                ? 'bg-slate-700 text-slate-200 placeholder-slate-400' 
                                : 'bg-white text-gray-900 placeholder-gray-500'
                            }`}
                            placeholder="Enter email address"
                          />
                          {tourGuideForm.email && !tourGuideFormErrors.email && emailPattern.test(tourGuideForm.email) && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                          {tourGuideFormErrors.email && (
                            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                          )}
                        </div>
                        {tourGuideFormErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{tourGuideFormErrors.email}</p>
                        )}
                      </div>                      {/* Password Field - Only show for new tour guides */}
                      {!editingTourGuide && (
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Password
                          </label>
                          <div className={`relative border rounded-md ${
                            tourGuideFormErrors.password ? 'border-red-500' : isDarkMode ? 'border-slate-600' : 'border-gray-300'
                          }`}>
                            <input
                              type={showTourGuidePassword ? "text" : "password"}
                              value={tourGuideForm.password}
                              onChange={(e) => handleTourGuideInputChange('password', e.target.value)}
                              className={`w-full px-3 py-2 pr-16 outline-none rounded-md ${
                                isDarkMode 
                                  ? 'bg-slate-700 text-slate-200 placeholder-slate-400' 
                                  : 'bg-white text-gray-900 placeholder-gray-500'
                              }`}
                              placeholder="Enter password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowTourGuidePassword(!showTourGuidePassword)}
                              className={`absolute right-8 top-1/2 transform -translate-y-1/2 ${
                                isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {showTourGuidePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            {tourGuideForm.password && !tourGuideFormErrors.password && passwordPattern.test(tourGuideForm.password) && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                            )}
                            {tourGuideFormErrors.password && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                            )}
                          </div>
                          {tourGuideFormErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{tourGuideFormErrors.password}</p>
                          )}
                        </div>
                      )}

                      {/* Submit Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-[#BF9264] hover:bg-amber-800 text-white py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Processing...' : (editingTourGuide ? 'Update Tour Guide' : 'Add Tour Guide')}
                        </button>
                        <button
                          type="button"
                          onClick={resetTourGuideForm}
                          disabled={loading}
                          className={`flex-1 py-2 px-4 rounded-md transition-colors disabled:cursor-not-allowed ${
                            isDarkMode 
                              ? 'bg-slate-600 hover:bg-slate-500 text-slate-200 disabled:bg-slate-700' 
                              : 'bg-gray-300 hover:bg-gray-400 text-gray-700 disabled:bg-gray-200'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Management</h3>
              <p className="text-gray-600">Booking management interface will be implemented here.</p>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                  Room Management
                </h3>
                {hasManagerOrAdminPrivileges() && (
                  <button
                    onClick={() => setShowRoomForm(true)}
                    disabled={loading}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Room</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Loading rooms...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Room Number
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Type
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Status
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(rooms) && rooms.length === 0 ? (
                        <tr>
                          <td colSpan="4" className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            No rooms found. Add your first room to get started.
                          </td>
                        </tr>
                      ) : (
                        Array.isArray(rooms) && rooms.map((room) => (
                          <tr key={room.id} className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-100'}`}>
                            <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                              {room.room_no}
                            </td>
                            <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                              {room.type}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleRoomAvailability(room.id, room.available)}
                                disabled={loading}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  room.available
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {room.available ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditRoom(room)}
                                  disabled={loading}
                                  className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode 
                                      ? 'text-blue-400 hover:text-blue-300' 
                                      : 'text-blue-600 hover:text-blue-800'
                                  }`}
                                  title="Edit Room"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {hasAdminPrivileges() && (
                                  <button
                                    onClick={() => handleDeleteRoom(room.id)}
                                    disabled={loading}
                                    className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                      isDarkMode 
                                        ? 'text-red-400 hover:text-red-300' 
                                        : 'text-red-600 hover:text-red-800'
                                    }`}
                                    title="Delete Room (Admin Only)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )) || (
                        <tr>
                          <td colSpan="4" className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            Loading rooms...
                          </td>
                        </tr>
                      )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Room Types Management Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Room Types Management
                  </h3>
                  <button
                    onClick={() => setShowRoomTypeForm(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Room Type</span>
                  </button>
                </div>

                <div className={`rounded-lg shadow-sm border overflow-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <table className="w-full">
                    <thead className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Type Name
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Description
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Created At
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(roomTypes) && roomTypes.length === 0 ? (
                        <tr>
                          <td colSpan="4" className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            No room types found. Add your first room type to get started.
                          </td>
                        </tr>
                      ) : (
                        Array.isArray(roomTypes) && roomTypes.map((roomType) => (
                          <tr key={roomType.id || roomType.name || Math.random()} className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-100'}`}>
                            <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                              <span className="font-medium">{roomType.name || roomType}</span>
                            </td>
                            <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                              {roomType.description || 'No description'}
                            </td>
                            <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm`}>
                              {roomType.createdAt ? new Date(roomType.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditRoomType(roomType)}
                                  disabled={loading}
                                  className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode 
                                      ? 'text-blue-400 hover:text-blue-300' 
                                      : 'text-blue-600 hover:text-blue-800'
                                  }`}
                                  title="Edit Room Type"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {hasAdminPrivileges() && (
                                  <button
                                    onClick={() => handleDeleteRoomType(roomType.id)}
                                    disabled={loading}
                                    className={`p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                      isDarkMode 
                                        ? 'text-red-400 hover:text-red-300' 
                                        : 'text-red-600 hover:text-red-800'
                                    }`}
                                    title="Delete Room Type (Admin Only)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )) || (
                        <tr>
                          <td colSpan="4" className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            Loading room types...
                          </td>
                        </tr>
                      )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Room Form Modal */}
              {showRoomForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className={`rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                        {editingRoom ? 'Edit Room' : 'Add New Room'}
                      </h4>
                      <button
                        onClick={resetRoomForm}
                        className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleRoomSubmit} className="space-y-4">
                      {/* Room Type Field */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Room Type
                        </label>
                        <div className="flex space-x-2">
                          <select
                            value={roomForm.type}
                            onChange={(e) => setRoomForm(prev => ({ ...prev, type: e.target.value }))}
                            className={`flex-1 px-3 py-2 border rounded-md outline-none ${
                              roomFormErrors.type ? 'border-red-500' : 
                              isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-gray-300 bg-white text-gray-900'
                            }`}
                          >
                            <option value="">Select Room Type</option>
                            {Array.isArray(roomTypes) && roomTypes.map((type) => (
                              <option key={type.id || type.name || Math.random()} value={type.name || type}>
                                {type.name || type}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowNewTypeModal(true)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            title="Add New Type"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {roomFormErrors.type && (
                          <p className="text-red-500 text-xs mt-1">{roomFormErrors.type}</p>
                        )}
                      </div>

                      {/* Room Number Field */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Room Number
                        </label>
                        <input
                          type="text"
                          value={roomForm.room_no}
                          onChange={(e) => setRoomForm(prev => ({ ...prev, room_no: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md outline-none ${
                            roomFormErrors.room_no ? 'border-red-500' : 
                            isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Enter room number (e.g., 101, A-12)"
                        />
                        {roomFormErrors.room_no && (
                          <p className="text-red-500 text-xs mt-1">{roomFormErrors.room_no}</p>
                        )}
                      </div>

                      {/* Available Checkbox */}
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={roomForm.available}
                            onChange={(e) => setRoomForm(prev => ({ ...prev, available: e.target.checked }))}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Room is available for booking
                          </span>
                        </label>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Saving...' : (editingRoom ? 'Update Room' : 'Add Room')}
                        </button>
                        <button
                          type="button"
                          onClick={resetRoomForm}
                          className={`flex-1 py-2 px-4 rounded-md ${
                            isDarkMode 
                              ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* New Room Type Modal */}
              {showNewTypeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className={`rounded-lg p-6 w-full max-w-md mx-4 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                        Add New Room Type
                      </h4>
                      <button
                        onClick={() => {
                          setShowNewTypeModal(false);
                          setNewTypeForm({ name: '', description: '' });
                        }}
                        className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Type Name *
                        </label>
                        <input
                          type="text"
                          value={newTypeForm.name}
                          onChange={(e) => setNewTypeForm(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md outline-none ${
                            isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Enter room type name (e.g., Deluxe, Standard)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCreateNewType();
                            }
                          }}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Description
                        </label>
                        <textarea
                          value={newTypeForm.description}
                          onChange={(e) => setNewTypeForm(prev => ({ ...prev, description: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md outline-none h-20 resize-none ${
                            isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Enter room type description (optional)"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleCreateNewType}
                          disabled={loading || !newTypeForm.name.trim()}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Creating...' : 'Create Type'}
                        </button>
                        <button
                          onClick={() => {
                            setShowNewTypeModal(false);
                            setNewTypeForm({ name: '', description: '' });
                          }}
                          className={`flex-1 py-2 px-4 rounded-md ${
                            isDarkMode 
                              ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Room Type Form Modal */}
              {showRoomTypeForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className={`rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                        {editingRoomType ? 'Edit Room Type' : 'Add Room Type'}
                      </h4>
                      <button
                        onClick={resetRoomTypeForm}
                        className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleRoomTypeSubmit} className="space-y-4">
                      {/* Room Type Name Field */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Type Name *
                        </label>
                        <input
                          type="text"
                          value={roomTypeForm.name}
                          onChange={(e) => setRoomTypeForm(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md outline-none ${
                            roomTypeFormErrors.name ? 'border-red-500' : 
                            isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Enter room type name (e.g., Deluxe, Standard)"
                        />
                        {roomTypeFormErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{roomTypeFormErrors.name}</p>
                        )}
                      </div>

                      {/* Room Type Description Field */}
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Description
                        </label>
                        <textarea
                          value={roomTypeForm.description}
                          onChange={(e) => setRoomTypeForm(prev => ({ ...prev, description: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md outline-none h-24 resize-none ${
                            isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Enter room type description (optional)"
                        />
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Saving...' : (editingRoomType ? 'Update Room Type' : 'Add Room Type')}
                        </button>
                        <button
                          type="button"
                          onClick={resetRoomTypeForm}
                          className={`flex-1 py-2 px-4 rounded-md ${
                            isDarkMode 
                              ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Settings</h3>
              
              {/* Account Settings */}
              <div className={`rounded-lg shadow-sm border p-6 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                  <User className="w-5 h-5 mr-2" />
                  Account Settings
                </h4>
                
                <div className="space-y-4">
                  {/* Profile Information */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Profile Information</h5>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      <p><span className="font-medium">Name:</span> {adminInfo.name}</p>
                      <p><span className="font-medium">Email:</span> {adminInfo.email}</p>
                      <p><span className="font-medium">Role:</span> {adminInfo.role}</p>
                    </div>
                  </div>
                  
                  {/* Change Password */}
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${
                    isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      <Lock className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                      <div>
                        <h5 className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Change Password</h5>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Update your account password</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="bg-[#BF9264] hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>{/* Appearance Settings */}
              <div className={`rounded-lg shadow-sm border p-6 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                  <Settings className="w-5 h-5 mr-2" />
                  Appearance
                </h4>
                
                <div className="space-y-4">
                  {/* Dark Mode Toggle */}
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${
                    isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      {isDarkMode ? (
                        <Moon className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                      ) : (
                        <Sun className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                      )}
                      <div>
                        <h5 className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Dark Mode</h5>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-[#BF9264]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>              {/* Security Settings */}
              <div className={`rounded-lg shadow-sm border p-6 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                  <Shield className="w-5 h-5 mr-2" />
                  Security
                </h4>
                
                <div className="space-y-4">
                  {/* Session Information */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Session Information</h5>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      <p><span className="font-medium">Last Login:</span> Just now</p>
                      <p><span className="font-medium">Session Status:</span> Active</p>
                    </div>
                  </div>                  
                  {/* Logout All Sessions */}
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${
                    isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      <LogOut className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                      <div>
                        <h5 className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Logout All Sessions</h5>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Sign out from all devices</p>
                      </div>
                    </div>                    <button
                      onClick={handleLogout}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className={`rounded-lg shadow-sm border border-red-200 p-6 ${
                isDarkMode ? 'bg-slate-800 border-red-800' : 'bg-white'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  <UserX className="w-5 h-5 mr-2" />
                  Danger Zone
                </h4>
                
                <div className="space-y-4">
                  {/* Delete Account */}
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${
                    isDarkMode 
                      ? 'border-red-800 bg-red-900/20' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div>
                      <h5 className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Delete Account</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <h4 className="text-xl font-semibold text-gray-800">{confirmTitle}</h4>
            </div>
            
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmYes}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleConfirmNo}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className={`text-xl font-semibold flex items-center ${
                isDarkMode ? 'text-slate-200' : 'text-gray-800'
              }`}>
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </h4>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordErrors({});
                }}
                className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Current Password
                </label>
                <div className={`relative border rounded-md ${
                  passwordErrors.currentPassword 
                    ? 'border-red-500' 
                    : isDarkMode 
                      ? 'border-slate-600' 
                      : 'border-gray-300'
                }`}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 outline-none rounded-md ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-200 placeholder-slate-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  New Password
                </label>
                <div className={`relative border rounded-md ${
                  passwordErrors.newPassword 
                    ? 'border-red-500' 
                    : isDarkMode 
                      ? 'border-slate-600' 
                      : 'border-gray-300'
                }`}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    className={`w-full px-3 py-2 pr-16 outline-none rounded-md ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-200 placeholder-slate-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-8 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {passwordForm.newPassword && !passwordErrors.newPassword && passwordPattern.test(passwordForm.newPassword) && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                  {passwordErrors.newPassword && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                  )}
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Confirm New Password
                </label>
                <div className={`relative border rounded-md ${
                  passwordErrors.confirmPassword 
                    ? 'border-red-500' 
                    : isDarkMode 
                      ? 'border-slate-600' 
                      : 'border-gray-300'
                }`}>
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 pr-16 outline-none rounded-md ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-200 placeholder-slate-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className={`absolute right-8 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {passwordForm.confirmPassword && !passwordErrors.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                  {passwordErrors.confirmPassword && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                  )}
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>              
              {/* Form Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#BF9264] hover:bg-amber-800 text-white py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                  }}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors disabled:cursor-not-allowed ${
                    isDarkMode 
                      ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
