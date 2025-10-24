"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "../../../components/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    shopName: user?.shopName || "",
    gstNumber: user?.gstNumber || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Mobile number validation
  const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // GST number validation
  const isValidGST = (gst) => {
    // GST format: 2 digits state code + 10 digits PAN + 1 digit entity + 1 digit check sum
    // Example: 27AAPFU0939F1Z5
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation
    if (!formData.username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!isValidMobile(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    if (!formData.shopName.trim()) {
      setError("Shop name is required");
      setLoading(false);
      return;
    }

    if (!isValidGST(formData.gstNumber)) {
      setError("Please enter a valid GST number");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('shopName', formData.shopName);
      formDataToSend.append('gstNumber', formData.gstNumber);
      
      // Add avatar file if selected
      if (fileInputRef.current?.files[0]) {
        formDataToSend.append('avatar', fileInputRef.current.files[0]);
      }

      const result = await updateProfile(formDataToSend);
      if (result.success) {
        setMessage(result.message);
        setIsEditing(false);
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setMessage(result.message);
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred while changing password");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      shopName: user?.shopName || "",
      gstNumber: user?.gstNumber || ""
    });
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage("");
    setError("");
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setMessage("");
    setError("");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Improved avatar handling with better fallback
  const getAvatarUrl = () => {
    if (avatarPreview) {
      return avatarPreview;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    // Generate a proper fallback avatar with the user's name
    const name = user?.username || user?.email || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=200&bold=true&font-size=0.8`;
  };

  const currentAvatar = getAvatarUrl();

  // Image error handler
  const handleImageError = (e) => {
    const name = user?.username || user?.email || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=200&bold=true&font-size=0.8`;
  };

  // Debug information
  console.log('Profile Debug Info:', {
    user,
    currentAvatar,
    avatarPreview,
    hasAvatar: !!user?.avatar
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Debug Info */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded text-sm">
          <strong>Debug Info:</strong><br/>
          User Avatar: {user?.avatar || 'None'}<br/>
          Current Avatar URL: {currentAvatar}<br/>
          Has Preview: {avatarPreview ? 'Yes' : 'No'}
        </div> 
      )} */}

      {/* Profile Information */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        
        {!isEditing ? (
          <div className="space-y-4">
            {/* Avatar Display */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={currentAvatar} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={handleImageError}
                />
              </div>
              {/* <div>
                <h4 className="text-lg font-semibold">{user?.username || "N/A"}</h4>
                <p className="text-gray-600">{user?.email || "N/A"}</p>
              </div> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Username:</span>
                <p className="text-gray-900">{user?.username || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{user?.email || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Mobile Number:</span>
                <p className="text-gray-900">{user?.mobile || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Shop Name:</span>
                <p className="text-gray-900">{user?.shopName || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">GST Number:</span>
                <p className="text-gray-900 font-mono">{user?.gstNumber || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Role:</span>
                <p className="text-gray-900 capitalize">{user?.role || "N/A"}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Upload */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={currentAvatar} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  onError={handleImageError}
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">Click the camera icon to change avatar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.username && formData.username.trim() === "" ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formData.username && formData.username.trim() === "" && (
                  <p className="text-red-500 text-xs mt-1">Username is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.email && !isValidEmail(formData.email) ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.mobile && !isValidMobile(formData.mobile) ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="10 digits starting with 6-9"
                  required
                />
                {formData.mobile && !isValidMobile(formData.mobile) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit mobile number</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.shopName && formData.shopName.trim() === "" ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formData.shopName && formData.shopName.trim() === "" && (
                  <p className="text-red-500 text-xs mt-1">Shop name is required</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number *
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    formData.gstNumber && !isValidGST(formData.gstNumber) ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 27AAPFU0939F1Z5"
                  required
                />
                {formData.gstNumber && !isValidGST(formData.gstNumber) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid GST number (15 characters)</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Change Password</h3>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
      <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={cancelPasswordChange}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}