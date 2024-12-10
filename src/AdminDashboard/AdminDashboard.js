import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import axios from "axios"; // Using axios for API calls


const AdminDashboard = () => {
  const [jobList, setJobList] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = "https://host-wo44.onrender.com/api"; // Backend API base URL

  useEffect(() => {
    const registerAs = sessionStorage.getItem("registerAs");

    // Redirect non-employer users to home
    if (registerAs !== "employer") {
      navigate("/");
      return;
    }

    // Fetch job data from API
    const fetchJobList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch job listings");
        }

        const data = response.data;

        // Fetch and set initial status from localStorage for each job
        const updatedData = data.map((job) => {
          const storedStatus = localStorage.getItem(`job-status-${job.job_id}`);
          return {
            ...job,
            status: storedStatus || job.status, // Use stored status or default job status
          };
        });

        setJobList(updatedData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch job listings. Please try again later.");
      }
    };

    fetchJobList();
  }, [navigate]);

  // Toggle job status between "Active" and "Closed"
  const handleStatusChange = async (jobId) => {
    const updatedJobList = jobList.map((job) => {
      if (job.job_id === jobId) {
        const newStatus = job.status === "Active" ? "Closed" : "Active";

        // Persist status change to backend
        axios
          .put(`${API_BASE_URL}/jobs/${jobId}/toggle-status`)
          .then(() => {
            console.log(`Job status updated to ${newStatus}`);
          })
          .catch((error) => {
            console.error("Error updating job status:", error);
            alert("Failed to update job status. Please try again.");
          });

        // Update status locally
        localStorage.setItem(`job-status-${jobId}`, newStatus);
        return { ...job, status: newStatus };
      }
      return job;
    });

    setJobList(updatedJobList);
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <table className="job-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Job Posting Date</th>
            <th>No. of Applicants</th>
            <th>Applicant Statuses</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobList.length > 0 ? (
            jobList.map((job) => (
              <tr key={job.job_id}>
                <td>{job.job_title || "N/A"}</td>
                <td>
                  {job.posting_date
                    ? new Date(job.posting_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{job.applicants_count || 0}</td>
                <td>{job.applicant_statuses || "N/A"}</td>
                <td>
                  <button
                    className={`status-button ${
                      job.status === "Active" ? "active" : "closed"
                    }`}
                    onClick={() => handleStatusChange(job.job_id)}
                  >
                    {job.status || "No Status"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No job listings available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
