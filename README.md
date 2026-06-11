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

Ejecutar los comandos desde `backend`.

### Stack original

Levanta solamente la app, MariaDB y ELK:

```powershell
docker-compose -f src/main/docker/app.yml -f src/main/docker/elk.yml up -d --force-recreate
```

### Stack original + Ionic

Levanta app, MariaDB, ELK y la web Ionic:

```powershell
docker-compose -f src/main/docker/app.yml -f src/main/docker/elk.yml -f src/main/docker/frontend.yml up -d --force-recreate --build
```

### Rebuild completo de pruebas

Regenera la imagen Docker del backend y recrea el stack con Ionic:

```powershell
.\mvnw.cmd -Pprod -ntp verify -DskipTests jib:dockerBuild
docker-compose -f src/main/docker/app.yml -f src/main/docker/elk.yml -f src/main/docker/frontend.yml up -d --force-recreate --build
```

### Apagar el stack

```powershell
docker-compose -f src/main/docker/app.yml -f src/main/docker/elk.yml -f src/main/docker/frontend.yml down
```
