import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const userFullName = localStorage.getItem("userFullName") || "Guide";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    window.dispatchEvent(new CustomEvent('userLogout'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Guide Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">Welcome back, {userFullName}!</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">🗓️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          My Tours
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Assigned tours & schedule
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Tourist Groups
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage tourist groups
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">⭐</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Reviews & Ratings
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          View customer feedback
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Guide Responsibilities</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  As a tour guide, your main responsibilities include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Leading assigned tours and providing excellent service</li>
                  <li>Managing tourist groups and ensuring their safety</li>
                  <li>Updating tour status and completion reports</li>
                  <li>Maintaining professional knowledge of tour locations</li>
                  <li>Collecting and responding to customer feedback</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button className="bg-[#BF9264] hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-lg transition">
                  View Today's Tours
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">
                  Update Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
