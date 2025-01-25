# Use OpenJDK 17 as a parent image
FROM openjdk:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the local code to the container
COPY . /app

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the app using Maven
RUN mvn clean install

# Expose the port the app runs on
EXPOSE 8080

# Run the Spring Boot app
CMD ["java", "-jar", "java -jar target/portfolio-services-0.0.1-SNAPSHOT.jar"]