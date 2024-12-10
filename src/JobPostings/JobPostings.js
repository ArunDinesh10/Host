import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobPostings.css";

// Use your deployed API base URL
const API_BASE_URL = "https://host-wo44.onrender.com/api";

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    job_title: "",
    job_description: "",
    job_category: "",
    location: "",
    salary_range: "",
    requirements: "",
  });
  const [filters, setFilters] = useState({ category: "", location: "" });
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const employerId = sessionStorage.getItem("employerId");

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`, {
        params: { ...filters },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
  
    // Ensure all fields are filled out
    if (
      !newJob.job_title ||
      !newJob.job_description ||
      !newJob.job_category ||
      !newJob.location ||
      !newJob.salary_range ||
      !newJob.requirements ||
      !employerId
    ) {
      alert("Please fill out all fields before submitting.");
      return;
    }
  
    try {
      console.log("Payload being sent:", { employer_id: employerId, ...newJob }); // Debug payload
  
      const response = await axios.post(`${API_BASE_URL}/jobs`, {
        employer_id: employerId,
        ...newJob,
      });
  
      console.log("Job created successfully:", response.data);
      fetchJobs(); // Refresh job list
      setNewJob({
        job_title: "",
        job_description: "",
        job_category: "",
        location: "",
        salary_range: "",
        requirements: "",
      });
      setAccordionOpen(false);
    } catch (error) {
      console.error("Error creating job:", error);
      alert(error.response?.data?.error || "Failed to create job. Please try again.");
    }
  };
  

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const categoryInput = document.getElementById("categoryInput").value.trim();
    const locationInput = document.getElementById("locationInput").value.trim();

    setFilters({
      category: categoryInput,
      location: locationInput,
    });
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowPopup(true);
  };

  const handleUpdateJob = async () => {
    try {
      await axios.put(`${API_BASE_URL}/jobs/${editingJob.job_id}`, {
        ...editingJob,
      });
      fetchJobs();
      setShowPopup(false);
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    }
  };

  const handlePopupInputChange = (e) => {
    const { name, value } = e.target;
    setEditingJob((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="job-postings-container">
      <main className="content">
        <div className="accordion">
          <button
            className="accordion-header"
            onClick={() => setAccordionOpen((prev) => !prev)}
          >
            {accordionOpen ? "Close Create Job Form" : "Open Create Job Form"}
          </button>
          {accordionOpen && (
            <div className="accordion-content">
              <form className="job-form" onSubmit={handleCreateJob}>
                {[{ name: "job_title", placeholder: "Job Title" }].map(
                  (field, idx) => (
                    <input
                      key={idx}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={newJob[field.name]}
                      onChange={handleInputChange}
                      required
                    />
                  )
                )}
                <button type="submit">Create Job</button>
              </form>
            </div>
          )}
        </div>
        <div className="list-section">
          <h2>Job Postings</h2>
          <form className="filters" onSubmit={handleSearch}>
            <input
              id="categoryInput"
              type="text"
              placeholder="Search by Category"
              defaultValue={filters.category}
            />
            <input
              id="locationInput"
              type="text"
              placeholder="Search by Location"
              defaultValue={filters.location}
            />
            <button type="submit">Search</button>
          </form>
          <table className="job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.job_title}</td>
                  <td>{job.job_category}</td>
                  <td>{job.location}</td>
                  <td>{job.salary_range}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleEditJob(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDeleteJob(job.job_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Job</h2>
            {Object.keys(newJob).map((key, idx) => (
              <input
                key={idx}
                name={key}
                placeholder={key.replace("_", " ").toUpperCase()}
                value={editingJob[key] || ""}
                onChange={handlePopupInputChange}
              />
            ))}
            <button onClick={handleUpdateJob}>Update Job</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;
