import React, { useState } from "react";
import axios from "axios";
import "./MockTest.css";

const MockTest = () => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const topics = ["React", "JavaScript", "HTML", "Angular"]; // Topics for the dropdown

  // Fetch questions for the selected topic
  const handleTopicChange = async (e) => {
    const selectedTopic = e.target.value;
    setTopic(selectedTopic);
    setQuestions([]);
    setAnswers({});
    setScore(null);

    if (selectedTopic) {
      try {
        const response = await axios.get(
          `https://host-wo44.onrender.com/api/mocktest/questions/${selectedTopic}`
        );
        setQuestions(response.data); // API should return a list of questions with options and correct answers
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to fetch questions. Please try again.");
      }
    }
  };

  // Store the selected answer for each question
  const handleOptionSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Calculate the score on submission
  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
  };

  return (
    <div className="mock-test">
      <h1 className="mock-test-header">Mock Test</h1>

      {/* Dropdown for selecting topic */}
      <div className="dropdown-container">
        <select
          onChange={handleTopicChange}
          value={topic}
          className="dropdown"
        >
          <option value="">Select a Topic</option>
          {topics.map((t, index) => (
            <option key={index} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Render questions */}
      {questions.length > 0 && (
        <div className="questions-container">
          {questions.map((q) => (
            <div key={q.id} className="question-block">
              <h3 className="question">{q.question}</h3>
              <div className="options-container">
                {q.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      onChange={() => handleOptionSelect(q.id, option)}
                      checked={answers[q.id] === option}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="submit-button-container">
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Display score after submission */}
      {score !== null && (
        <div className="result-container">
          <h2>
            Your Score: {score}/{questions.length}
          </h2>
        </div>
      )}
    </div>
  );
};

export default MockTest;
