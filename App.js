import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
