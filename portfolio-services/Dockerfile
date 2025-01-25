# Use OpenJDK 17 base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy Maven Wrapper files (mvnw, mvnw.cmd, .mvn folder) into the container
COPY .mvn/ .mvn/
COPY mvnw mvnw
COPY pom.xml .

# Make the mvnw file executable
RUN chmod +x mvnw

# Run the Maven Wrapper to build the application (using mvnw)
#RUN ./mvnw clean install -DskipTests

# Copy the built JAR file into the container
COPY target/portfolio-services-0.0.1-SNAPSHOT.jar /app/portfolio-services.jar

# Expose the port that your Spring Boot app will run on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "portfolio-services.jar"]