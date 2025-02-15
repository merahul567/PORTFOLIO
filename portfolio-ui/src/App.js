import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage.js";
import AboutPage from "./components/AboutPage";
import BlogPage from "./components/BlogPage";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import "./App.css";
import ProjectPage from "./components/ProjectPage.js";

const App = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="app-container">
      <Navbar setActiveSection={setActiveSection} />
      <div className="content">
        {activeSection === "home" && <HomePage />}
        {activeSection === "about" && <AboutPage />}
        {activeSection === "blog" && <BlogPage />}
        {activeSection === "project" && <ProjectPage />}
        {activeSection === "contact" && <ContactPage />}
      </div>
      <Footer />
    </div>
  );
};

export default App;