import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="app">

      <header className="navbar">

        <div className="brand">
          <div className="brand-icon">SC</div>

          <div>
            <h2>SmartClinic</h2>
            <span>Queue made simple</span>
          </div>
        </div>

        <nav>
          <a href="#clinics">Find a Clinic</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>

          <button
            className="nav-login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </nav>

      </header>

      <main>

        <section className="hero">

          <div className="hero-left">

            <div className="location-label">
              <span className="pulse"></span>
              Clinics are updating live
            </div>

            <h1>
              Don't wait at the clinic.
              <br />
              <span>Know when to go.</span>
            </h1>

            <p className="hero-description">
              Check the live queue at nearby clinics, join remotely,
              and arrive when your turn is getting close.
            </p>

            <div className="search-box">

              <div className="search-icon">
                ⌕
              </div>

              <div className="search-content">

                <span>
                  Search for a clinic
                </span>

                <small>
                  Clinic name or location
                </small>

              </div>

              <button>
                Search
              </button>

            </div>

            <div className="quick-info">

              <div>
                <strong>Live queue</strong>
                <span>See current crowd</span>
              </div>

              <div>
                <strong>Digital token</strong>
                <span>Join from anywhere</span>
              </div>

              <div>
                <strong>Smart alerts</strong>
                <span>Know your turn</span>
              </div>

            </div>

          </div>


          <div className="hero-right">

            <div className="queue-card">

              <div className="card-top">

                <div>

                  <span className="live-badge">
                    <i></i>
                    LIVE NOW
                  </span>

                  <h3>
                    City Care Clinic
                  </h3>

                  <p>
                    Vijay Nagar · Indore
                  </p>

                </div>

                <button className="more-btn">
                  •••
                </button>

              </div>


              <div className="crowd-section">

                <div className="crowd-number">

                  <strong>
                    12
                  </strong>

                  <span>
                    patients waiting
                  </span>

                </div>


                <div className="wait-time">

                  <span>
                    Estimated wait
                  </span>

                  <strong>
                    ~30 min
                  </strong>

                </div>

              </div>


              <div className="queue-line">

                <div className="queue-label">

                  <span>
                    Current queue
                  </span>

                  <strong>
                    Token #20
                  </strong>

                </div>


                <div className="queue-track">

                  <div className="queue-fill"></div>

                </div>

                <div className="queue-bottom">

                  <span>
                    12 waiting
                  </span>

                  <span>
                    Doctor consulting
                  </span>

                </div>

              </div>


              <button
                className="join-button"
                onClick={() => navigate("/login")}
              >

                Join this queue

                <span>
                  →
                </span>

              </button>

              <div className="doctor-info">

                <div className="doctor-avatar">
                  DR
                </div>

                <div>

                  <strong>
                    Dr. Rahul Sharma
                  </strong>

                  <span>
                    General Physician · 15 min/patient
                  </span>

                </div>

                <span className="open-status">
                  Open
                </span>

              </div>

            </div>

          </div>

        </section>

        <section className="trust-strip">

          <div>
            <strong>Real-time</strong>
            <span>queue updates</span>
          </div>

          <div>
            <strong>No unnecessary</strong>
            <span>waiting</span>
          </div>

          <div>
            <strong>Simple</strong>
            <span>digital tokens</span>
          </div>

          <div>
            <strong>Smart</strong>
            <span>notifications</span>
          </div>

        </section>

        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="section-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Three steps. Less waiting.
            </h2>

            <p>
              SmartClinic keeps you informed from the moment
              you check the queue until your consultation.
            </p>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <div>

                <h3>
                  Find your clinic
                </h3>

                <p>
                  Search nearby clinics and check how busy
                  they are before you leave home.
                </p>

              </div>

            </div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <div>

                <h3>
                  Join the queue
                </h3>

                <p>
                  Get a digital token and track your position
                  without standing in a physical line.
                </p>

              </div>

            </div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <div>

                <h3>
                  Come when it's your turn
                </h3>

                <p>
                  Receive updates and notifications as your
                  consultation time gets closer.
                </p>

              </div>

            </div>

          </div>

        </section>

        <section
          className="clinic-section"
          id="clinics"
        >

          <div className="clinic-heading">

            <div>

              <span>
                AROUND YOU
              </span>

              <h2>
                Clinics you can check
              </h2>

            </div>

            <button className="view-all">
              View all →
            </button>

          </div>


          <div className="clinic-grid">

            <div className="clinic-small-card">

              <div className="clinic-card-top">

                <span className="status-dot"></span>

                <span>
                  12 waiting
                </span>

              </div>

              <h3>
                City Care Clinic
              </h3>

              <p>
                Vijay Nagar, Indore
              </p>

              <div className="clinic-card-bottom">

                <span>
                  ~30 min wait
                </span>

                <button>
                  View
                </button>

              </div>

            </div>


            <div className="clinic-small-card">

              <div className="clinic-card-top">

                <span className="status-dot"></span>

                <span>
                  7 waiting
                </span>

              </div>

              <h3>
                LifeLine Clinic
              </h3>

              <p>
                Palasia, Indore
              </p>

              <div className="clinic-card-bottom">

                <span>
                  ~20 min wait
                </span>

                <button>
                  View
                </button>

              </div>

            </div>


            <div className="clinic-small-card">

              <div className="clinic-card-top">

                <span className="status-dot"></span>

                <span>
                  4 waiting
                </span>

              </div>

              <h3>
                Health First
              </h3>

              <p>
                Rau, Indore
              </p>

              <div className="clinic-card-bottom">

                <span>
                  ~15 min wait
                </span>

                <button>
                  View
                </button>

              </div>

            </div>

          </div>

        </section>

        <section className="cta">

          <div>

            <span>
              SMARTER CLINIC VISITS
            </span>

            <h2>
              Your time matters.
              <br />
              Don't spend it waiting.
            </h2>

          </div>

          <button
            onClick={() => navigate("/login")}
          >
            Find a clinic →
          </button>

        </section>

      </main>

      <footer>

        <div className="footer-brand">

          <div className="brand-icon">
            SC
          </div>

          <div>

            <h3>
              SmartClinic
            </h3>

            <span>
              Queue made simple
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;