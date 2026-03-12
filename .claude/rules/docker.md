# Docker rules

Apply when editing:

- Dockerfile
- docker-compose.yml
- docker-compose.yaml
- .devcontainer/
- scripts related to container startup

## Rules

- Use non-root containers where practical.
- Do not embed secrets in images, Dockerfiles, compose files, or build args.
- Prefer multi-stage builds.
- Keep container images minimal.
- Pin base image versions where practical.
- Copy only the files needed for the build or runtime image.
- Avoid installing unnecessary OS packages.
- Prefer reproducible builds and clear startup commands.