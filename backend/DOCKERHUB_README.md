# microblogging-backend

API REST del sistema Microblogging, construida con Spring Boot y JHipster.

## Stack tecnológico

- **Java 21** sobre Eclipse Temurin JRE 25
- **Spring Boot 4.0** (Web, Security, Data JPA, Validation, Mail, Actuator)
- **MariaDB** en producción / **H2** en desarrollo
- **Liquibase** para migraciones de base de datos
- **JWT** con Spring Security OAuth2 Resource Server
- **ELK Stack** (Logstash + Elasticsearch) para logs
- **Prometheus** para métricas
- **OpenAPI / Swagger** con Springdoc

## Endpoints

| Prefijo           | Descripción              |
|-------------------|--------------------------|
| `/api/**`         | API REST                 |
| `/management/**`  | Health check y métricas  |
| `/v3/api-docs`    | Documentación OpenAPI    |

## Variables de entorno — SMTP / Mail (opcional)

El backend puede enviar correos transaccionales (confirmación de registro, recuperación de contraseña, etc.).
**No requiere configuración SMTP para funcionar** — por defecto intenta con `localhost:25` sin autenticación.

| Variable | Default | Descripción |
|---|---|---|
| `SPRING_MAIL_HOST` | `localhost` | Servidor SMTP |
| `SPRING_MAIL_PORT` | `25` | Puerto SMTP |
| `SPRING_MAIL_USERNAME` | _(vacío)_ | Usuario SMTP |
| `SPRING_MAIL_PASSWORD` | _(vacío)_ | Contraseña SMTP |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` | `false` | Habilitar autenticación |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` | `false` | Habilitar STARTTLS |
| `JHIPSTER_MAIL_FROM` | `blog@localhost` | Dirección remitente |
| `JHIPSTER_MAIL_BASE_URL` | `http://localhost:8081` | URL base para enlaces en correos |

Ejemplo con Gmail:

```yaml
environment:
  - SPRING_MAIL_HOST=smtp.gmail.com
  - SPRING_MAIL_PORT=587
  - SPRING_MAIL_USERNAME=tu@email.com
  - SPRING_MAIL_PASSWORD=tu-contraseña
  - SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
  - SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
  - JHIPSTER_MAIL_FROM=tu@email.com
  - JHIPSTER_MAIL_BASE_URL=https://tudominio.com
```

## Uso

```yaml
services:
  backend:
    image: ijgutierrez/microblogging-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod,api-docs,secret-samples
      - SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/blog
```

## Tags

- `latest` — última versión estable