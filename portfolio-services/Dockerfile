# Use OpenJDK 17 as a parent image
FROM openjdk:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory into the container
COPY target/portfolio-services-0.0.1-SNAPSHOT.jar /app/portfolio-services.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the Spring Boot app using the JAR file
CMD ["java", "-jar", "portfolio-services.jar"]