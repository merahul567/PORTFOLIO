import React from "react";
import "./BlogPage.css";

const BlogPage = () => {
  return (
    <div className="page-container">
      <h1>Tech Blog</h1>
      <p>Stay updated with the latest trends in technology.</p>
      <ul className="blog-list">
        <li>🔹 Latest Trends in Java Development</li>
        <li>🔹 Best Practices for React Performance Optimization</li>
        <li>🔹 Microservices Architecture with Spring Boot</li>
      </ul>
    </div>
  );
};

export default BlogPage;