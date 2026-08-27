# ---------- Build Stage ----------
# Use Eclipse Temurin JDK 17 (official OpenJDK successor)
FROM eclipse-temurin:17-jdk AS build

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
# Use Eclipse Temurin JRE 17 for lightweight runtime
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]