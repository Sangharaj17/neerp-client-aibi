"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast, Toaster } from "react-hot-toast";


export default function CustomerSiteTodoForm({ onSuccess, onClose }) {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [executives, setExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");

  // Fetch sites with customer data
  useEffect(() => {
    axiosInstance
      .get("/api/sites/sites-with-customer")
      .then((res) => setSites(res.data))
      .catch((err) => console.error("Error fetching sites:", err));
  }, []);

  // Fetch executives
  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const res = await axiosInstance.get("/api/employees/executives");
        setExecutives(res.data);
      } catch (error) {
        console.error("Failed to fetch executives:", error);
      }
    };
    fetchExecutives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSite) {
      alert("Please select a site");
      return;
    }
    if (!selectedExecutive) {
      alert("Please select an executive");
      return;
    }

    const selected = sites.find((s) => s.siteId == selectedSite);

    const body = {
      siteId: selected.siteId,
      customerId: selected.customerId,
      executiveId: selectedExecutive,
      purpose,
      date,
      time,
      place,
      status: "Pending",
    };

    try {
      await axiosInstance.post("/api/customer/customer-site-todos", body);
    //  alert("Todo Created!");
     toast.success("Todo created successfully!");
      onSuccess(); // refresh list
      onClose(); // close modal
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Error creating todo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Site Dropdown */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Select Site</label>
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Site</option>
          {sites.map((s) => (
            <option key={s.siteId} value={s.siteId}>
              Mr. {s.customerName} – {s.siteName} ({s.siteAddress})
            </option>
          ))}
        </select>
      </div>

      {/* Executive Dropdown */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Select Executive</label>
        <select
          value={selectedExecutive}
          onChange={(e) => setSelectedExecutive(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Executive</option>
          {executives.map((exec) => (
            <option key={exec.employeeId} value={exec.employeeId}>
              {exec.employeeName}
            </option>
          ))}
        </select>
      </div>

      {/* Purpose Input */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Purpose</label>
        <input
          type="text"
          placeholder="Enter Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Input */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Time Input */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Place Input */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">Place</label>
        <input
          type="text"
          placeholder="Enter Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
      >
        Create Todo
      </button>
    </form>
  );
}
