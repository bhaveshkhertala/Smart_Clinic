import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        localStorage.setItem(
          "smartClinicUser",
          JSON.stringify(data)
        );

        navigate("/dashboard");

      } else {

        setMessage(data.message || "Invalid email or password");

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to connect to SmartClinic server."
      );

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

            <span>SMARTER CLINIC VISITS</span>

            <h1>
              Your clinic visit,
              <br />
              <strong>without the wait.</strong>
            </h1>

            <p>
              Check your queue, track your token and
              stay informed about your consultation.
            </p>

          </div>


          <div className="login-feature">

            <div>✓</div>

            <p>
              <strong>Real-time queue tracking</strong>
              <br />
              Know your position before you arrive.
            </p>

          </div>


          <div className="login-feature">

            <div>✓</div>

            <p>
              <strong>Smart notifications</strong>
              <br />
              Get notified when your turn is close.
            </p>

          </div>

        </div>


        <div className="login-box">

          <div className="login-heading">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your SmartClinic account.
            </p>

          </div>


          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <div className="form-group">

              <div className="password-label">

                <label>Password</label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              {loading
                ? "Signing in..."
                : "Sign in"
              }

              {!loading && <span>→</span>}

            </button>

          </form>


          <div className="register-link">

            Don't have an account?

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create account
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

export default Login;