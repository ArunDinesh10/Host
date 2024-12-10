import React, { useEffect, useState } from "react";
import "./ApplicationHistory.css";

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = sessionStorage.getItem("user_id");

  const API_BASE_URL = "https://host-wo44.onrender.com/api"; // Deployed backend URL

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!userId) {
      alert("User not logged in. Redirecting to login.");
      window.location.href = "/login";
      return;
    }

    fetchApplicationHistory();
  }, [userId]);

  const fetchApplicationHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/history/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch application history");
      }
      const data = await response.json();
      console.log("Fetched application history:", data);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching application history:", error);
      alert("Failed to fetch application history. Please try again.");
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="application-history">
          <h2>Application History</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <table className="application-history-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Status</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.application_id}>
                    <td>{app.job_title}</td>
                    <td>{app.status}</td>
                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHistory;
