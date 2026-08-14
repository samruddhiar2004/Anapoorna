# Stage 1: Build Java 23 Jar using Maven
FROM maven:3.9.9-eclipse-temurin-23 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run Application with Eclipse Temurin JDK 23
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app
COPY --from=build /app/target/anapoorna-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
