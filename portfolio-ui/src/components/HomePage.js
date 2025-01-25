import React, { useState, useEffect } from "react";
import { axiosGet } from "../apiService.js"; 

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to My Portfolio</h1>
      <p className="text-lg text-gray-600 mt-4">{greeting || "Loading greeting..."}</p>
    </div>
  );
};

export default HomePage;
