import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SavedJobs.css";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const userId = sessionStorage.getItem("user_id"); // Retrieve user ID from sessionStorage
  console.log("Retrieved User ID:", userId); // Debugging

  const API_BASE_URL = "https://host-wo44.onrender.com/api"; // API base URL

  useEffect(() => {
    if (!userId) {
      alert("User not logged in. Redirecting to login.");
      window.location.href = "/login"; // Redirect to login if user is not logged in
    } else {
      fetchSavedJobs();
    }
  }, [userId]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await axios.get(`${API_BASE_URL}/saved-jobs/${userId}`);
      setSavedJobs(response.data || []); // Ensure `savedJobs` is always an array
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      alert(
        error.response?.data?.error || "Failed to fetch saved jobs. Please try again."
      );
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const filteredJobs = savedJobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="saved-jobs-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <h2>Saved Jobs</h2>
          {loading ? (
            <p>Loading saved jobs...</p>
          ) : filteredJobs.length > 0 ? (
            <table className="saved-jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Salary Range</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.job_id}>
                    <td>{job.job_title}</td>
                    <td>{job.job_category}</td>
                    <td>{job.location}</td>
                    <td>{job.salary_range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No saved jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
