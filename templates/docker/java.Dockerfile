# Please visit https://docs.docker.com/reference/dockerfile/ to gain more information about Dockerfile.

# See also https://stackoverflow.com/questions/26077543/how-to-name-dockerfiles

# You can change all of the setup on this file, so enjoy it!
# build stage.
FROM maven:3.9.9-eclipse-temurin-24-alpine AS builder

WORKDIR /path/to/your-app

COPY . .

RUN mvn clean install -DskipTests

# runtime stage.
FROM openjdk:24-jdk-oracle

WORKDIR /path/to/your-app

COPY --from=builder /your-app/target/your-app-0.0.1-SNAPSHOT.jar your-app.jar

ENTRYPOINT [ "java", "-jar", "your-app.jar" ]