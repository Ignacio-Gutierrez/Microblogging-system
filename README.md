# Microblogging-system

## Servicios de desarrollo

### Backend (Spring Boot)

```text
http://localhost:8080
```

- API REST: `http://localhost:8080/api/...`
- Consola H2: `http://localhost:8080/h2-console` solo en perfil dev local; el stack Docker usa MariaDB.

### Frontend (Ionic)

```text
http://localhost:8100
```

Durante desarrollo, el frontend corre en `localhost:8100`. Usa un proxy simple para que la web pueda llamar a la API con rutas relativas como `/api/posts`.

### Logs (ELK Stack)

```text
http://localhost:5601
```

Los logs de la aplicacion se envian a Logstash en `localhost:5000` y se visualizan en Kibana.

## Docker Compose

Ejecutar los comandos desde la raiz del repositorio.

### Stack publicado

Levanta backend, frontend, MariaDB y ELK usando las imagenes publicadas en DockerHub.
ELK corre como servicio `elk` con la imagen all-in-one `sebp/elk`.

```powershell
docker compose up -d --wait
```

Frontend: `http://localhost:8081`
Backend: `http://localhost:8080`
Kibana: `http://localhost:5601`

Por defecto usa el namespace `ijgutierrez`. Para probar otro namespace:

```powershell
$env:DOCKERHUB_NAMESPACE="tuusuario"
docker compose up -d --wait
```

### Credenciales de correo

Para enviar correos reales desde el backend, copiá `.env.example` a `.env` y completá las variables SMTP:

```powershell
Copy-Item .env.example .env
```

El compose usa esas variables para configurar `SPRING_MAIL_*` y `JHIPSTER_MAIL_*` dentro del contenedor backend. No subas `.env` al repositorio.

### Publicar imagenes desde Jenkins

Crear en Jenkins la credencial `dockerhub-login` como `Username with password`.
El pipeline publica:

- `ijgutierrez/microblogging-backend:latest`
- `ijgutierrez/microblogging-frontend:latest`

El backend tambien publica una etiqueta con la version Maven del proyecto.

### Rebuild local de pruebas

Regenera la imagen Docker del backend localmente y compila el frontend:

```powershell
cd backend
.\mvnw.cmd -Pprod -ntp verify -DskipTests jib:dockerBuild

cd ..\frontend
npm ci
npm run build
docker build -t ijgutierrez/microblogging-frontend:latest .
```

### Apagar el stack

```powershell
docker compose down -v
```
