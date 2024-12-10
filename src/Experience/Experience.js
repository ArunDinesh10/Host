import React, { useState } from 'react';
import axios from 'axios';
import '../PersonalInfo/PersonalInfo.css'; // Ensure consistent styling

const Experience = ({ nextStep, prevStep, handleChange, formData, userId }) => {
  const [experiences, setExperiences] = useState([]);
  const [currentExperience, setCurrentExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    responsibilities: [],
  });

  const [responsibility, setResponsibility] = useState('');
  const [errors, setErrors] = useState({});

  const addResponsibility = () => {
    if (responsibility.trim()) {
      setCurrentExperience((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibility.trim()],
      }));
      setResponsibility('');
    }
  };

  const removeResponsibility = (index) => {
    setCurrentExperience((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const validateExperience = () => {
    const newErrors = {};
    if (!currentExperience.company.trim()) newErrors.company = 'Company name is required';
    if (!currentExperience.position.trim()) newErrors.position = 'Position is required';
    if (!currentExperience.startDate) newErrors.startDate = 'Start date is required';
    if (!currentExperience.isCurrent && !currentExperience.endDate) {
      newErrors.endDate = 'End date is required if not currently working';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addExperience = () => {
    if (!validateExperience()) return;

    const newExperiences = [...experiences, currentExperience];
    setExperiences(newExperiences);
    saveExperience({ ...currentExperience, userId });
    resetCurrentExperience();
  };

  const resetCurrentExperience = () => {
    setCurrentExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      responsibilities: [],
    });
    setResponsibility('');
  };

  const saveExperience = async (experienceData) => {
    const responsibilitiesString = experienceData.responsibilities.join(', ');
    const dataToSend = { ...experienceData, responsibilities: responsibilitiesString };

    try {
      const response = await axios.post('https://host-wo44.onrender.com/api/experience', dataToSend); // Replace with your API endpoint
      console.log(response.data);
    } catch (error) {
      console.error('Error saving experience data:', error);
      alert('Failed to save experience. Please try again.');
    }
  };

  const handleNext = () => {
    handleChange('experience', experiences); // Pass the experiences array to the parent
    nextStep();
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="heading">Professional Experience</h2>

        <div className="input-row">
          <input
            className={`personal-input ${errors.company ? 'error' : ''}`}
            type="text"
            placeholder="Company Name"
            value={currentExperience.company}
            onChange={(e) =>
              setCurrentExperience({ ...currentExperience, company: e.target.value })
            }
          />
          <input
            className={`personal-input ${errors.position ? 'error' : ''}`}
            type="text"
            placeholder="Position"
            value={currentExperience.position}
            onChange={(e) =>
              setCurrentExperience({ ...currentExperience, position: e.target.value })
            }
          />
        </div>
        {errors.company && <p className="error-message">{errors.company}</p>}
        {errors.position && <p className="error-message">{errors.position}</p>}

        <div className="input-row">
          <input
            className={`personal-input ${errors.startDate ? 'error' : ''}`}
            type="date"
            placeholder="Start Date"
            value={currentExperience.startDate}
            onChange={(e) =>
              setCurrentExperience({ ...currentExperience, startDate: e.target.value })
            }
          />
          <input
            className={`personal-input ${errors.endDate ? 'error' : ''}`}
            type="date"
            placeholder="End Date"
            value={currentExperience.endDate}
            onChange={(e) =>
              setCurrentExperience({ ...currentExperience, endDate: e.target.value })
            }
            disabled={currentExperience.isCurrent}
          />
        </div>
        {errors.startDate && <p className="error-message">{errors.startDate}</p>}
        {errors.endDate && <p className="error-message">{errors.endDate}</p>}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={currentExperience.isCurrent}
            onChange={(e) =>
              setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked })
            }
          />
          I am currently working here
        </label>

        <div className="input-row">
          <input
            className="personal-input"
            type="text"
            placeholder="Add a responsibility"
            value={responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
          />
          <button type="button" className="personal-input" onClick={addResponsibility}>
            Add Responsibility
          </button>
        </div>

        <ul className="responsibilities-list">
          {currentExperience.responsibilities.map((resp, index) => (
            <li key={index} className="responsibility-item">
              {resp}
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeResponsibility(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="input-row">
          <button type="button" className="personal-input" onClick={addExperience}>
            Add Experience
          </button>
          <button type="button" className="personal-input" onClick={prevStep}>
            Back
          </button>
          <button type="button" className="personal-input" onClick={handleNext}>
            Next
          </button>
        </div>

        <h3>Added Experiences</h3>
        <ul>
          {experiences.map((exp, index) => (
            <li key={index}>
              {exp.company} - {exp.position} ({exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate})
              <ul>
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Experience;
