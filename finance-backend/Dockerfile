FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper and pom first to maximize layer caching
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline

# Copy source and build executable jar
COPY src ./src
RUN ./mvnw -q -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app

# Render provides PORT at runtime; Spring reads it via application.yml
ENV PORT=8080
EXPOSE 8080

COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
