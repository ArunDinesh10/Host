import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobPostings.css";
import { apiClient } from "../api/apiClient"; // Ensure this path is correct

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
      const response = await apiClient.get("/jobs", {
        params: { ...filters },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/jobs", {
        employer_id: employerId,
        ...newJob,
      });
      fetchJobs();
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
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await apiClient.delete(`/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
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
    setEditingJob(job); // Set the job to be edited
    setShowPopup(true); // Show the popup
  };

  const handleUpdateJob = async () => {
    try {
      await apiClient.put(`/jobs/${editingJob.job_id}`, {
        ...editingJob,
      });
      fetchJobs();
      setShowPopup(false); // Close the popup
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handlePopupInputChange = (e) => {
    const { name, value } = e.target;
    setEditingJob((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="job-postings-container">
      <main className="content">
        {/* Accordion for Job Creation */}
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
                {[
                  { name: "job_title", placeholder: "Job Title", required: true },
                  {
                    name: "job_description",
                    placeholder: "Job Description",
                    required: true,
                    type: "textarea",
                  },
                  { name: "job_category", placeholder: "Category" },
                  { name: "location", placeholder: "Location" },
                  { name: "salary_range", placeholder: "Salary Range" },
                  {
                    name: "requirements",
                    placeholder: "Requirements",
                    type: "textarea",
                  },
                ].map((field, idx) =>
                  field.type === "textarea" ? (
                    <textarea
                      key={idx}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={newJob[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                    />
                  ) : (
                    <input
                      key={idx}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={newJob[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                    />
                  )
                )}
                <button type="submit">Create Job</button>
              </form>
            </div>
          )}
        </div>

        {/* Job List */}
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

      {/* Popup for Job Editing */}
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
