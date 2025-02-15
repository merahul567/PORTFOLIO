import React from "react";
import "./Navbar.css";

const Navbar = ({ setActiveSection }) => {
  return (
    <nav className="navbar">
      <button onClick={() => setActiveSection("home")}>Home</button>
      <button onClick={() => setActiveSection("about")}>About Me</button>
      <button onClick={() => setActiveSection("blog")}>Blog</button>
      <button onClick={() => setActiveSection("project")}>Project</button>
      <button onClick={() => setActiveSection("contact")}>Contact</button>
    </nav>
  );
};

export default Navbar;