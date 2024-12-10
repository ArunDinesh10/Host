import React, { useState } from 'react';
import '../PersonalInfo/PersonalInfo.css'; // Ensure the CSS file path is correct

const Education = ({ nextStep, prevStep, handleChange, formData }) => {
  const [education, setEducation] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
  });

  const [errors, setErrors] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
  });

  // Validate input fields
  const validateFields = () => {
    let valid = true;
    const newErrors = {
      degree: '',
      institution: '',
      graduationYear: '',
    };

    if (!education.degree.trim()) {
      newErrors.degree = 'Degree is required';
      valid = false;
    }

    if (!education.institution.trim()) {
      newErrors.institution = 'Institution is required';
      valid = false;
    }

    if (!education.graduationYear.trim() || isNaN(education.graduationYear)) {
      newErrors.graduationYear = 'Graduation Year must be a number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addEducation = () => {
    if (!validateFields()) return;

    handleChange('education', [...formData.education, education]);
    setEducation({
      degree: '',
      institution: '',
      graduationYear: '',
    });
    nextStep();
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="heading">Education</h2>

        <div className="input-row">
          <div className="input-group">
            <input
              className={`personal-input ${errors.degree ? 'error' : ''}`}
              type="text"
              placeholder="Degree"
              value={education.degree}
              onChange={(e) =>
                setEducation({ ...education, degree: e.target.value })
              }
            />
            {errors.degree && <p className="error-message">{errors.degree}</p>}
          </div>
          <div className="input-group">
            <input
              className={`personal-input ${errors.institution ? 'error' : ''}`}
              type="text"
              placeholder="Institution"
              value={education.institution}
              onChange={(e) =>
                setEducation({ ...education, institution: e.target.value })
              }
            />
            {errors.institution && (
              <p className="error-message">{errors.institution}</p>
            )}
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <input
              className={`personal-input ${
                errors.graduationYear ? 'error' : ''
              }`}
              type="text"
              placeholder="Graduation Year"
              value={education.graduationYear}
              onChange={(e) =>
                setEducation({
                  ...education,
                  graduationYear: e.target.value,
                })
              }
            />
            {errors.graduationYear && (
              <p className="error-message">{errors.graduationYear}</p>
            )}
          </div>
        </div>

        <div className="input-row">
          <button className="personal-input" onClick={prevStep}>
            Back
          </button>
          <button className="personal-input" onClick={addEducation}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Education;
