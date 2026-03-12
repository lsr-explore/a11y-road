# Docker rules

Apply when editing:

Dockerfile
docker-compose.yml
.devcontainer/

Rules:

- Use non-root containers when possible
- Avoid embedding secrets
- Use multi-stage builds
- Keep container images minimal