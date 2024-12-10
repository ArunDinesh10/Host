import React, { useState } from "react";
import axios from "axios";
import "./PaymentGateway.css";

const PaymentGateway = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;

    if (!paymentDetails.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!emailRegex.test(paymentDetails.email)) newErrors.email = "Invalid email format.";
    if (!phoneRegex.test(paymentDetails.phone)) newErrors.phone = "Phone number must be 10 digits.";
    if (!paymentDetails.cardName.trim()) newErrors.cardName = "Card Name is required.";
    if (!cardNumberRegex.test(paymentDetails.cardNumber)) newErrors.cardNumber = "Card Number must be 16 digits.";
    if (!cvvRegex.test(paymentDetails.cvv)) newErrors.cvv = "CVV must be 3 digits.";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error for the specific field
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://host-wo44.onrender.com/api/payment",
        paymentDetails
      );
      alert(response.data.message);
      setPaymentDetails({
        fullName: "",
        email: "",
        phone: "",
        cardName: "",
        cardNumber: "",
        cvv: "",
      });
    } catch (error) {
      console.error("Payment Error:", error);
      alert(
        error.response?.data?.error || "Error processing payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-gateway-container">
      <h2>Payment Gateway</h2>
      <form className="payment-form" onSubmit={handlePayment} noValidate>
        {[ // Define input fields dynamically
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Name on Credit Card", name: "cardName", type: "text" },
          { label: "Credit Card Number", name: "cardNumber", type: "text" },
          { label: "CVV", name: "cvv", type: "password" },
        ].map((field, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={paymentDetails[field.name]}
              onChange={handleInputChange}
              required
            />
            {errors[field.name] && <small className="error">{errors[field.name]}</small>}
          </div>
        ))}
        <button type="submit" className="pay-button" disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentGateway;
