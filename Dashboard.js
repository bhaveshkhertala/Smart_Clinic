import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE_URL = "http://localhost:8080/api";

function Dashboard() {
  const navigate = useNavigate();

  // ================= USER =================

  const [user, setUser] = useState(null);

  // ================= MAIN DATA =================

  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queues, setQueues] = useState([]);
  const [myQueues, setMyQueues] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ================= UI STATES =================

  const [loading, setLoading] = useState(true);
  const [joiningQueue, setJoiningQueue] = useState(false);
  const [message, setMessage] = useState("");

  // ================= JOIN QUEUE =================

  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [priority, setPriority] = useState("NORMAL");

  // ================= SEARCH =================

  const [searchText, setSearchText] = useState("");

  // ================= QUEUE INFO =================

  const [queueInfo, setQueueInfo] = useState({});

  // =========================================================
  // HELPER FUNCTIONS
  // =========================================================

  const getClinicIdFromDoctor = (doctor) => {
    return (
      doctor?.clinic?.id ??
      doctor?.clinicId ??
      doctor?.clinicID ??
      null
    );
  };

  const getClinicNameFromDoctor = (doctor) => {
    return (
      doctor?.clinic?.name ||
      doctor?.clinicName ||
      "Clinic not available"
    );
  };

  const getDoctorSpecialization = (doctor) => {
    return (
      doctor?.specialization ||
      doctor?.speciality ||
      doctor?.specialty ||
      doctor?.department ||
      doctor?.expertise ||
      "General Physician"
    );
  };

  const getClinicAddress = (clinic) => {
    const parts = [
      clinic?.address,
      clinic?.city
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(", ")
      : "Location not available";
  };

  const getClinicDoctors = (clinicId) => {
    return doctors.filter(
      (doctor) =>
        Number(getClinicIdFromDoctor(doctor)) === Number(clinicId)
    );
  };

  const getDoctorQueues = (doctorId) => {
    return queues.filter(
      (queue) =>
        Number(queue?.doctor?.id) === Number(doctorId)
    );
  };

  const getWaitingQueuesForDoctor = (doctorId) => {
    return getDoctorQueues(doctorId).filter(
      (queue) => queue.status === "WAITING"
    );
  };

  const getClinicWaitingPatients = (clinicId) => {
    const clinicDoctorIds = getClinicDoctors(clinicId).map(
      (doctor) => Number(doctor.id)
    );

    return queues.filter(
      (queue) =>
        queue.status === "WAITING" &&
        clinicDoctorIds.includes(Number(queue?.doctor?.id))
    ).length;
  };

  const getDoctorWaitingPatients = (doctorId) => {
    return getWaitingQueuesForDoctor(doctorId).length;
  };

  const getDoctorEstimatedWait = (doctor) => {
    const waitingPatients = getDoctorWaitingPatients(doctor.id);

    const consultationTime =
      Number(doctor?.consultationTime) || 15;

    return waitingPatients * consultationTime;
  };

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboardData = async (loggedInUser, showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const [
        clinicsResponse,
        doctorsResponse,
        queuesResponse,
        notificationsResponse
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/clinics`),
        fetch(`${API_BASE_URL}/doctors`),
        fetch(`${API_BASE_URL}/queues`),
        fetch(
          `${API_BASE_URL}/notifications/patient/${loggedInUser.id}`
        )
      ]);

      if (
        !clinicsResponse.ok ||
        !doctorsResponse.ok ||
        !queuesResponse.ok ||
        !notificationsResponse.ok
      ) {
        throw new Error("Failed to load dashboard data");
      }

      const clinicsData = await clinicsResponse.json();
      const doctorsData = await doctorsResponse.json();
      const queuesData = await queuesResponse.json();
      const notificationsData =
        await notificationsResponse.json();

      setClinics(Array.isArray(clinicsData) ? clinicsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setQueues(Array.isArray(queuesData) ? queuesData : []);
      setNotifications(
        Array.isArray(notificationsData)
          ? notificationsData
          : []
      );

      // Only logged-in patient's queues
      const patientQueues = (
        Array.isArray(queuesData) ? queuesData : []
      ).filter(
        (queue) =>
          Number(queue?.patient?.id) === Number(loggedInUser.id)
      );

      setMyQueues(patientQueues);

    } catch (error) {
      console.error("Dashboard loading error:", error);
      setMessage(
        "Unable to load dashboard data. Please check the backend."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // =========================================================
  // LOGIN CHECK + AUTO REFRESH
  // =========================================================

  useEffect(() => {
    const savedUser =
      localStorage.getItem("smartClinicUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const loggedInUser = JSON.parse(savedUser);

      setUser(loggedInUser);
      loadDashboardData(loggedInUser, true);

      // Refresh queue information every 15 seconds
      const refreshInterval = setInterval(() => {
        loadDashboardData(loggedInUser, false);
      }, 15000);

      return () => clearInterval(refreshInterval);

    } catch (error) {
      console.error("User data error:", error);
      localStorage.removeItem("smartClinicUser");
      navigate("/login");
    }
  }, [navigate]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("smartClinicUser");
    navigate("/login");
  };

  // =========================================================
  // SEARCH RESULTS
  // =========================================================

  const searchResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const results = [];

    clinics.forEach((clinic) => {
      const clinicDoctors = getClinicDoctors(clinic.id);

      const clinicName =
        String(clinic?.name || "").toLowerCase();

      const clinicAddress =
        String(getClinicAddress(clinic)).toLowerCase();

      const clinicMatches =
        clinicName.includes(query) ||
        clinicAddress.includes(query);

      const matchingDoctors = clinicDoctors.filter(
        (doctor) => {
          const doctorName =
            String(doctor?.name || "").toLowerCase();

          const specialization =
            String(
              getDoctorSpecialization(doctor)
            ).toLowerCase();

          return (
            doctorName.includes(query) ||
            specialization.includes(query)
          );
        }
      );

      if (clinicMatches || matchingDoctors.length > 0) {
        results.push({
          clinic,
          doctors: clinicMatches
            ? clinicDoctors
            : matchingDoctors,
          matchedByDoctor: !clinicMatches
        });
      }
    });

    return results;
  }, [searchText, clinics, doctors, queues]);

  // =========================================================
  // SEARCH CLEAR
  // =========================================================

  const clearSearch = () => {
    setSearchText("");
  };

  // =========================================================
  // SELECT CLINIC
  // =========================================================

  const handleClinicChange = (event) => {
    const clinicId = event.target.value;

    setSelectedClinic(clinicId);
    setSelectedDoctor("");
    setMessage("");

    if (!clinicId) {
      return;
    }

    const clinicDoctors = getClinicDoctors(clinicId);

    if (clinicDoctors.length === 1) {
      setSelectedDoctor(String(clinicDoctors[0].id));
    }
  };

  // =========================================================
  // SELECT SEARCH RESULT
  // =========================================================

  const selectDoctorFromSearch = (clinicId, doctorId) => {
    setSelectedClinic(String(clinicId));
    setSelectedDoctor(String(doctorId));
    setMessage("");

    setTimeout(() => {
      const joinSection =
        document.getElementById("join-queue-section");

      if (joinSection) {
        joinSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  // =========================================================
  // VIEW QUEUE
  // =========================================================

  const handleViewQueue = (clinicId, doctorId) => {
    setSelectedClinic(String(clinicId));
    setSelectedDoctor(
      doctorId ? String(doctorId) : ""
    );

    setTimeout(() => {
      const queueSection =
        document.getElementById("queue-information-section");

      if (queueSection) {
        queueSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  // =========================================================
  // JOIN QUEUE
  // =========================================================

  const handleJoinQueue = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!selectedClinic || !selectedDoctor) {
      setMessage(
        "Please select a clinic and doctor."
      );
      return;
    }

    if (!user?.id) {
      setMessage(
        "User information missing. Please login again."
      );
      return;
    }

    setJoiningQueue(true);

    const queueData = {
      patient: {
        id: user.id
      },

      doctor: {
        id: Number(selectedDoctor)
      },

      priority: priority
    };

    console.log(
      "Sending queue data:",
      queueData
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/queues`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(queueData)
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Backend status:",
        response.status
      );

      console.log(
        "Backend response:",
        responseText
      );

      if (!response.ok) {
        setMessage(
          `Backend Error ${response.status}: ${responseText}`
        );
        return;
      }

      setMessage(
        "Successfully joined the queue. Your token has been generated."
      );

      setSelectedClinic("");
      setSelectedDoctor("");
      setPriority("NORMAL");

      await loadDashboardData(user, false);

      // Go to My Queue section
      setTimeout(() => {
        const queueSection =
          document.getElementById(
            "queue-information-section"
          );

        if (queueSection) {
          queueSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 300);

    } catch (error) {
      console.error(
        "Join queue error:",
        error
      );

      setMessage(
        `Connection Error: ${error.message}`
      );

    } finally {
      setJoiningQueue(false);
    }
  };

  // =========================================================
  // QUEUE INFORMATION
  // =========================================================

  const loadQueueInfo = async (queueId) => {
    try {
      const [
        patientsAheadResponse,
        waitTimeResponse
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/queues/${queueId}/patients-ahead`
        ),
        fetch(
          `${API_BASE_URL}/queues/${queueId}/wait-time`
        )
      ]);

      if (
        !patientsAheadResponse.ok ||
        !waitTimeResponse.ok
      ) {
        return;
      }

      const patientsAhead =
        await patientsAheadResponse.json();

      const waitTime =
        await waitTimeResponse.json();

      setQueueInfo((previous) => ({
        ...previous,

        [queueId]: {
          patientsAhead,
          waitTime
        }
      }));

    } catch (error) {
      console.error(
        "Queue information error:",
        error
      );
    }
  };

  // Load live information for patient's queues
  useEffect(() => {
    if (myQueues.length === 0) {
      return;
    }

    myQueues.forEach((queue) => {
      loadQueueInfo(queue.id);
    });
  }, [myQueues]);

  // =========================================================
  // DASHBOARD COUNTS
  // =========================================================

  const waitingPatients = queues.filter(
    (queue) => queue.status === "WAITING"
  ).length;

  const inProgressPatients = queues.filter(
    (queue) => queue.status === "IN_PROGRESS"
  ).length;

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <h2>
            Loading SmartClinic dashboard...
          </h2>

          <p>
            Please wait while we load clinics,
            doctors and queue information.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">

        <div>
          <h1>
            SmartClinic Dashboard
          </h1>

          <p>
            Find registered clinics, check live queues
            and manage your clinic visits.
          </p>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* =====================================================
          WELCOME
      ====================================================== */}

      <section className="welcome-card">

        <div>

          <span>
            WELCOME BACK
          </span>

          <h2>
            Hello, {user?.name || "Patient"} 👋
          </h2>

          <p>
            Search for a registered clinic or doctor
            and check the current queue before visiting.
          </p>

        </div>

        <div className="dashboard-role">
          {user?.role || "PATIENT"}
        </div>

      </section>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span>
            Registered Clinics
          </span>

          <strong>
            {clinics.length}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <span>
            Registered Doctors
          </span>

          <strong>
            {doctors.length}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <span>
            Waiting Patients
          </span>

          <strong>
            {waitingPatients}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <span>
            In Progress
          </span>

          <strong>
            {inProgressPatients}
          </strong>
        </div>

      </section>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="clinic-search-panel">

        <div className="search-heading">

          <div>
            <span className="search-eyebrow">
              SMARTCLINIC SEARCH
            </span>

            <h2>
              Find a Clinic or Doctor
            </h2>

            <p>
              Search only among clinics and doctors
              registered with SmartClinic.
            </p>
          </div>

        </div>

        <div className="clinic-search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search clinic, doctor or specialization..."
          />

          {searchText && (
            <button
              type="button"
              className="search-clear-button"
              onClick={clearSearch}
            >
              ×
            </button>
          )}

        </div>

        {/* =================================================
            SEARCH RESULTS
        ================================================== */}

        {searchText.trim() && (

          <div className="search-results">

            <div className="search-result-title">
              <strong>
                Search Results
              </strong>

              <span>
                {searchResults.length} clinic
                {searchResults.length !== 1
                  ? "s"
                  : ""} found
              </span>
            </div>

            {searchResults.length === 0 ? (

              <div className="no-search-results">

                <div className="no-result-icon">
                  🔎
                </div>

                <h3>
                  No registered clinic found
                </h3>

                <p>
                  Try searching with another
                  clinic name, doctor name or
                  specialization.
                </p>

              </div>

            ) : (

              <div className="search-result-list">

                {searchResults.map(
                  (result) => {

                    const clinic =
                      result.clinic;

                    const clinicDoctors =
                      result.doctors;

                    const waitingCount =
                      getClinicWaitingPatients(
                        clinic.id
                      );

                    return (
                      <div
                        className="clinic-search-result"
                        key={clinic.id}
                      >

                        {/* CLINIC HEADER */}

                        <div className="clinic-result-header">

                          <div className="clinic-result-icon">
                            🏥
                          </div>

                          <div className="clinic-result-main">

                            <h3>
                              {clinic.name ||
                                "Unnamed Clinic"}
                            </h3>

                            <p>
                              📍{" "}
                              {getClinicAddress(
                                clinic
                              )}
                            </p>

                          </div>

                          <span className="registered-badge">
                            ✓ Registered
                          </span>

                        </div>

                        {/* LIVE QUEUE */}

                        <div className="clinic-live-summary">

                          <div>
                            <span>
                              Patients Waiting
                            </span>

                            <strong>
                              {waitingCount}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Doctors
                            </span>

                            <strong>
                              {getClinicDoctors(
                                clinic.id
                              ).length}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Queue Status
                            </span>

                            <strong
                              className={
                                waitingCount > 0
                                  ? "queue-live"
                                  : "queue-available"
                              }
                            >
                              {waitingCount > 0
                                ? "LIVE"
                                : "AVAILABLE"}
                            </strong>
                          </div>

                        </div>

                        {/* DOCTORS */}

                        <div className="clinic-doctors-list">

                          <div className="doctor-list-heading">
                            Doctors
                          </div>

                          {clinicDoctors.length === 0 ? (

                            <p className="empty-doctor-text">
                              No doctors registered
                              for this clinic.
                            </p>

                          ) : (

                            clinicDoctors.map(
                              (doctor) => {

                                const doctorWaiting =
                                  getDoctorWaitingPatients(
                                    doctor.id
                                  );

                                const doctorWait =
                                  getDoctorEstimatedWait(
                                    doctor
                                  );

                                return (
                                  <div
                                    className="search-doctor-card"
                                    key={doctor.id}
                                  >

                                    <div className="search-doctor-avatar">
                                      {String(
                                        doctor?.name ||
                                          "D"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>

                                    <div className="search-doctor-info">

                                      <strong>
                                        {doctor.name}
                                      </strong>

                                      <span>
                                        {getDoctorSpecialization(
                                          doctor
                                        )}
                                      </span>

                                    </div>

                                    <div className="doctor-live-info">

                                      <div>
                                        <strong>
                                          {doctorWaiting}
                                        </strong>

                                        <span>
                                          waiting
                                        </span>
                                      </div>

                                      <div>
                                        <strong>
                                          {doctorWait}
                                        </strong>

                                        <span>
                                          min
                                        </span>
                                      </div>

                                    </div>

                                    <div className="doctor-result-actions">

                                      <button
                                        type="button"
                                        className="view-queue-button"
                                        onClick={() =>
                                          handleViewQueue(
                                            clinic.id,
                                            doctor.id
                                          )
                                        }
                                      >
                                        View Queue
                                      </button>

                                      <button
                                        type="button"
                                        className="search-join-button"
                                        onClick={() =>
                                          selectDoctorFromSearch(
                                            clinic.id,
                                            doctor.id
                                          )
                                        }
                                      >
                                        Join Queue
                                      </button>

                                    </div>

                                  </div>
                                );
                              }
                            )

                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          JOIN QUEUE
      ====================================================== */}

      <section
        id="join-queue-section"
        className="join-queue-panel"
      >

        <div className="panel-heading">

          <div>
            <span className="section-mini-label">
              QUEUE ACCESS
            </span>

            <h2>
              Join Clinic Queue
            </h2>
          </div>

        </div>

        <form
          onSubmit={handleJoinQueue}
          className="join-queue-form"
        >

          {/* CLINIC */}

          <div className="form-field">

            <label htmlFor="clinic">
              Select Clinic
            </label>

            <select
              id="clinic"
              value={selectedClinic}
              onChange={handleClinicChange}
            >

              <option value="">
                Choose clinic
              </option>

              {clinics.map((clinic) => (

                <option
                  key={clinic.id}
                  value={clinic.id}
                >
                  {clinic.name}
                </option>

              ))}

            </select>

          </div>

          {/* DOCTOR */}

          <div className="form-field">

            <label htmlFor="doctor">
              Select Doctor
            </label>

            <select
              id="doctor"
              value={selectedDoctor}
              onChange={(event) =>
                setSelectedDoctor(
                  event.target.value
                )
              }
              disabled={!selectedClinic}
            >

              <option value="">
                {selectedClinic
                  ? "Choose doctor"
                  : "Select clinic first"}
              </option>

              {selectedClinic &&
                getClinicDoctors(
                  selectedClinic
                ).map((doctor) => (

                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                    {" — "}
                    {getDoctorSpecialization(
                      doctor
                    )}
                  </option>

                ))}

            </select>

          </div>

          {/* PRIORITY */}

          <div className="form-field">

            <label htmlFor="priority">
              Queue Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value
                )
              }
            >

              <option value="NORMAL">
                Normal
              </option>

              <option value="PRIORITY">
                Priority
              </option>

            </select>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="join-queue-button"
            disabled={
              joiningQueue ||
              !selectedClinic ||
              !selectedDoctor
            }
          >
            {joiningQueue
              ? "Joining..."
              : "Join Queue"}
          </button>

        </form>

        {message && (
          <p className="queue-message">
            {message}
          </p>
        )}

      </section>

      {/* =====================================================
          MY QUEUE + NOTIFICATIONS
      ====================================================== */}

      <section
        id="queue-information-section"
        className="dashboard-content"
      >

        {/* ===================================================
            MY QUEUE
        ==================================================== */}

        <div className="dashboard-panel">

          <div className="panel-heading">

            <div>
              <span className="section-mini-label">
                LIVE STATUS
              </span>

              <h2>
                My Queue Details
              </h2>
            </div>

          </div>

          {myQueues.length === 0 ? (

            <p className="empty-text">
              You have not joined any queue yet.
            </p>

          ) : (

            <div className="my-queue-list">

              {myQueues.map((queue) => {

                const info =
                  queueInfo[queue.id];

                const clinicName =
                  queue?.doctor?.clinic?.name ||
                  getClinicNameFromDoctor(
                    queue?.doctor
                  );

                return (
                  <div
                    className="queue-row"
                    key={queue.id}
                  >

                    {/* LEFT */}

                    <div className="queue-main-info">

                      <strong>
                        Token #{queue.tokenNumber}
                      </strong>

                      <p className="queue-status">
                        {queue.status}
                      </p>

                      <small className="queue-location">
                        Clinic:{" "}
                        {clinicName}
                      </small>

                      <small className="queue-doctor">
                        Doctor:{" "}
                        {queue?.doctor?.name ||
                          "Not available"}
                      </small>

                      <small className="queue-specialization">
                        Specialization:{" "}
                        {getDoctorSpecialization(
                          queue?.doctor
                        )}
                      </small>

                    </div>

                    {/* RIGHT */}

                    <div className="queue-meta">

                      <span>
                        Priority:{" "}
                        {queue.priority ||
                          "NORMAL"}
                      </span>

                      <small>
                        Patients Ahead:{" "}
                        {info?.patientsAhead ??
                          0}
                      </small>

                      <small>
                        Estimated Wait:{" "}
                        {info?.waitTime ??
                          queue?.estimatedWaitTime ??
                          0}{" "}
                        minutes
                      </small>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ===================================================
            NOTIFICATIONS
        ==================================================== */}

        <div className="dashboard-panel">

          <div className="panel-heading">

            <div>
              <span className="section-mini-label">
                UPDATES
              </span>

              <h2>
                Notifications
              </h2>
            </div>

          </div>

          {notifications.length === 0 ? (

            <p className="empty-text">
              No notifications available.
            </p>

          ) : (

            <div className="notifications-list">

              {notifications.map(
                (notification) => (

                  <div
                    className="notification-row"
                    key={notification.id}
                  >

                    <strong>
                      {notification.type}
                    </strong>

                    <p>
                      {notification.message}
                    </p>

                    <small>
                      {notification.status}
                    </small>

                  </div>

                )
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;