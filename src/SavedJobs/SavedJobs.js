import React, { useEffect, useState } from "react";
import "./SavedJobs.css";

const API_BASE_URL = "https://host-wo44.onrender.com/api";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = sessionStorage.getItem("userId"); // Retrieve userId from session

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    fetch(`${API_BASE_URL}/saved-jobs/${userId}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No saved jobs found for this user.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSavedJobs(data))
      .catch((error) => console.error("Error fetching saved jobs:", error));
  }, [userId]);

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
          {filteredJobs.length > 0 ? (
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
