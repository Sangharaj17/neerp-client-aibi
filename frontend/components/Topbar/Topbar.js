'use client';
import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getTenant } from '@/utils/tenant';
import { toast } from 'react-hot-toast';
import axiosInstance from "@/utils/axiosInstance";
import axiosAdmin from '@/utils/axiosAdmin';

const Topbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const dropdownRef = useRef(null);


  const router = useRouter();
  const { tenant: tenantFromParams } = useParams();
  const tenant = tenantFromParams || getTenant();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  //const [clientname, setClientname] = useState('');
  const [userid, setUserid] = useState(0);
  const [modules, setModules] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (!tenant) return;

    const userKey = `${tenant}_username`;
    //const modulesKey = `${tenant}_modules`;
    const clientIdKey = `${tenant}_clientId`;
    const tokenKey = `${tenant}_token`;
    //const clientName = `${tenant}_clientName`;
    const userEmail = `${tenant}_userEmail`;

    const storedUsername = localStorage.getItem(userKey);
    const storedClientId = Number(localStorage.getItem(clientIdKey));
    //const storedModules = localStorage.getItem(modulesKey);
    const storedToken = localStorage.getItem(tokenKey);
    const storedUserEmail = localStorage.getItem(userEmail);
    //const storedClientName = localStorage.getItem(clientName);

    // console.log("📦 UserID Key:", clientIdKey);       // e.g., "client1_userid"
    // console.log("📦 Raw UserID Value:", localStorage.getItem(clientIdKey));      // e.g., "1" or null
    // console.log("📦 Parsed UserID:", storedClientId);

    // console.log("📦 Retrieved from localStorage:", storedUsername, storedToken);

    if (!storedUsername || !storedToken || !storedClientId || !storedUserEmail) {
      //router.push(`/${tenant}/login`);
      //return;
      handleLogout('Logging out');
    }

    setUsername(storedUsername);
    setToken(storedToken);
    setUserid(storedClientId);
    //setClientname(storedClientName);
    setUserEmail(storedUserEmail);

    //   try {
    //     const parsedModules = JSON.parse(storedModules);
    //     setModules(parsedModules);
    //   } catch (err) {
    //     console.error("❌ Failed to parse modules from localStorage:", err);
    //     setModules([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // }, [tenant, router]);

    const fetchModules = async () => {
      try {
        const res = await axiosAdmin.get(
          `/api/subscriptions/client/${storedClientId}/active-with-modules`
        );

        const data = res.data;

        setSubscriptions(data);

        const modules = Array.isArray(data)
          ? data.flatMap((sub) => sub.modules?.map((mod) => mod.name) || [])
          : data.modules || [];

        setModules(modules);
      } catch (err) {
        console.error("❌ Error fetching subscribed modules:", err);

        const errorMsg =
          err.response?.data?.error || err.message || "Error fetching subscribed modules.";

        if (errorMsg.includes("No active subscriptions")) {
          console.log(errorMsg);
          handleLogout(
            "Your subscription became inactive, so you have been logged out automatically."
          );
        } else {
          handleLogout("Error fetching subscribed modules.");
        }

        setModules([]);
      } finally {
        setLoading(false);
      }
    };


    // fetchModules();

  }, [tenant, router]);


  // Update current date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleLogout = async (customMessage = null) => {
    try {
      const tokenKey = `${tenant}_token`;
      const storedToken = localStorage.getItem(tokenKey);

      // 🔹 Use axiosInstance instead of fetch
      const res = await axiosInstance.post(
        "/api/logout",
        {}, // no body
        {
          headers: {
            Authorization: `Bearer ${storedToken}`, // attach token
          },
        }
      );

      // Clear localStorage for this tenant
      localStorage.removeItem(`${tenant}_username`);
      localStorage.removeItem(`${tenant}_modules`);
      localStorage.removeItem(`${tenant}_token`);
      localStorage.removeItem(`${tenant}_clientName`);
      localStorage.removeItem(`${tenant}_userEmail`);
      localStorage.removeItem(`${tenant}_clientId`);

      const message =
        typeof res.data.message === "string"
          ? res.data.message
          : "Logged out successfully";

      toast.success(customMessage || message);
      // Redirect to clean path; middleware resolves tenant
      router.push(`/auth/login`);
    } catch (error) {
      console.error("Logout failed:", error);

      // Check for API error response
      const errorMsg =
        error.response?.data?.error || "Logout failed due to error";

      toast.error(errorMsg);
    } finally {
      console.log("✅ Logging out...");
      if (setIsDropdownOpen) setIsDropdownOpen(false);
    }
  };



  const handleSettings = () => {
    // Handle settings logic here
    console.log('Opening settings...');
    setIsDropdownOpen(false);
  };

  // if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-white  border-b border-gray-200  h-16 flex items-center justify-between  px-4">
      <div className="flex items-center justify-between w-full">
        {/* Current Date */}
        <div className="flex items-center">
          <h1 className="text-sm font-medium text-gray-900">
            {currentDate}
          </h1>
        </div>

        <div className="text-sm font-medium text-gray-700">
          {subscriptions.map((sub, idx) => (
            <div key={idx}>
              📦 Modules: {sub.modules.map(mod => mod.name).join(', ')}<br />
              🗓️ From <strong>{sub.startDate}</strong> to <strong>{sub.endDate}</strong>
            </div>
          ))}
        </div>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{username}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                {/* <p className="text-sm font-medium text-gray-900">Dev's AIBI</p> */}
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>

              <button
                onClick={handleSettings}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>

              <button
                onClick={() => handleLogout()}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;