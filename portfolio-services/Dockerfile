# Use OpenJDK 17 base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy Maven Wrapper and POM file into the container
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make the Maven Wrapper script executable
RUN chmod +x mvnw

# Pre-download dependencies to make the build faster
RUN ./mvnw dependency:go-offline

# Copy the source code into the container
COPY src ./src

# Define the command to run the application
CMD ["./mvnw", "spring-boot:run"]