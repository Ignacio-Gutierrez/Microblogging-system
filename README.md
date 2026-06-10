# Microblogging-system

## 🌐 Conexión a Servicios (Desarrollo)

### Backend (Spring Boot)
```
http://localhost:8080
```
- **API REST**: `http://localhost:8080/api/...`
- **Consola H2** (BD en memoria): `http://localhost:8080/h2-console`

### Frontend (Ionic)
```
http://localhost:8100
```
- Se conecta al backend mediante proxy (archivo `proxy.config.mjs`).

### Logs (ELK Stack)
```bash
# Levantar Elasticsearch + Logstash + Kibana
docker compose -f src/main/docker/elk.yml up -d

# Acceder a Kibana
http://localhost:5601
```
Los logs de la aplicación se envían a Logstash en `localhost:5000` y se visualizan en Kibana.