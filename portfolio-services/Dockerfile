# ---------- Build Stage ----------
# Use Eclipse Temurin JDK 17 base image (actively maintained)
FROM eclipse-temurin:17-jdk-slim AS build

# Set working directory
WORKDIR /app

# Copy Maven Wrapper and POM file
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make Maven Wrapper executable
RUN chmod +x mvnw

# Pre-download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Package the application (skip tests for faster build, optional)
RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
# Use a smaller JRE image for running the app
FROM eclipse-temurin:17-jre-slim

# Set working directory
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]