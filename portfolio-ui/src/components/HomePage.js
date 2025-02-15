import React, { useState, useEffect } from "react";
import { axiosGet } from "../apiService.js"; 
import "./HomePage.css";

const HomePage = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    axiosGet("greeting")
      .then((response) => {
        setGreeting(response.message);
      })
      .catch((error) => {
        console.error("Error fetching greeting:", error);
      });
  }, []);
  
  return (
    <div className="page-container">
      <h1>Welcome to My Portfolio</h1>
      <p>{greeting || "Loading greeting..."}</p>
    </div>
  );
};

export default HomePage;