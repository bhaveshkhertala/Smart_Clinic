import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PATIENT"
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully. Please login.");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(data.message || "Registration failed.");
      }

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to SmartClinic server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-info">

          <div className="brand login-brand">
            <div className="brand-icon">SC</div>

            <div>
              <h2>SmartClinic</h2>
              <span>Queue made simple</span>
            </div>
          </div>

          <div className="login-message">
            <span>JOIN SMARTCLINIC</span>

            <h1>
              Better visits,
              <br />
              <strong>less waiting.</strong>
            </h1>

            <p>
              Create your account and manage your clinic visits
              with digital queue tracking.
            </p>
          </div>

        </div>


        <div className="login-box">

          <div className="login-heading">
            <h2>Create account</h2>
            <p>Register as a patient to continue.</p>
          </div>


          <form onSubmit={handleRegister}>

            <div className="form-group">
              <label>Full name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Phone number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>


            {message && (
              <div className="login-error">
                {message}
              </div>
            )}


            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <span>→</span>}
            </button>

          </form>


          <div className="register-link">
            Already have an account?

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>


          <div className="back-home">
            <button
              type="button"
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;