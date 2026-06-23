# microblogging-frontend

Frontend del sistema Microblogging, construido con Ionic y Angular. Aplicación web progresiva (PWA) con soporte para dispositivos móviles mediante Capacitor.

## Stack tecnológico

- **Angular 20** con **Ionic 8**
- **Capacitor 8** (App, Haptics, Keyboard, Status Bar)
- **Service Worker** para soporte offline
- **Nginx Alpine** como servidor web en producción

## Características

- Interfaz responsive adaptada a dispositivos móviles
- PWA instalable en el navegador
- Soporte para notificaciones push
- Tema oscuro
- Integración con la API REST del backend

## Uso

```yaml
services:
  frontend:
    image: ijgutierrez/microblogging-frontend:latest
    ports:
      - "8081:80"
    depends_on:
      - backend
```

## Tags

- `latest` — última versión estable