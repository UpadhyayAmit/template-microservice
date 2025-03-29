import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Adjust the path as per your routing setup
  };

  useEffect(() => {
    // Clear sessionStorage and localStorage when the component mounts
    sessionStorage.clear();
    localStorage.clear();
    console.log('Session storage and local storage cleared');
  }, []);

  const handleRefreshSession = () => {
    // Logic to refresh the session
    window.location.href = '/';
    console.log('Session refreshed');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Session Expired</h1>
      <p className="text-lg text-gray-600 mb-6">Your session has expired. Please log in again or refresh your session to continue.</p>
      <div className="flex space-x-4">
        <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={handleLoginRedirect}>
          Go to Login
        </button>
        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600" onClick={handleRefreshSession}>
          Refresh Session
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
