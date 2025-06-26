FROM maven:3.9.9-eclipse-temurin-24-alpine AS builder

WORKDIR /path/to/your-app

COPY . .

RUN mvn clean install -DskipTests

# runtime stage.
FROM openjdk:24-jdk-oracle

WORKDIR /path/to/your-app

COPY --from=builder /your-app/target/your-app-0.0.1-SNAPSHOT.jar your-app.jar

ENTRYPOINT [ "java", "-jar", "your-app.jar" ]