# Deploy

The app is deployed using CI/CD pipelines run by GitHub Actions. The pipelines are defined in the `.github/workflows` folder. The pipelines are triggered on every push to the `main` branch.

With this idea, no manual deployment should be done. The goal of this documentation is to document how the CI/CD pipelines work.

## Build and push Docker images

### 1. Prerequisites

#### 1.1. Get an access key

Since the images are stored in a private registry, an access key is required to be able to push the images.

On GCP, [download a service account key in JSON format](https://cloud.google.com/iam/docs/keys-create-delete), and save it in `.auth/auth.json`. Make sure the selected service account has the necessary permissions to push to the artifact registry.

Then, encode the key in base64. Run the following command to encode it:

```bash
base64 .auth/auth.json > .auth/auth64.txt
```

#### 1.2. Connect to the registry

The key is used to connect to the private registry with Docker.

```bash
cat .auth/auth64.txt | docker login -u _json_key_base64 --password-stdin us-east1-docker.pkg.dev
```

### 2. Build the images

The images are built with Docker. Each service has its own Dockerfile, either `Dockerfile.api`, `Dockerfile.api-admin`, `Dockerfile.client` and `Dockerfile.admin`.

The Dockerfile must be specified when building the image.

```bash
# API
docker build -f Dockerfile.api -t api .

# API Admin
docker build -f Dockerfile.api-admin -t api-admin .

# Client
docker build -f Dockerfile.client -t client .

# Admin
docker build -f Dockerfile.admin -t admin .
```

The images must be built for the `linux/amd64` architecture to be compatible with the GCP artifact registry. For ARM computers, use `docker buildx`:

```bash
# API
docker buildx build --platform linux/amd64 -f Dockerfile.api -t api .

# API Admin
docker buildx build --platform linux/amd64 -f Dockerfile.api-admin -t api-admin .

# Client
docker buildx build --platform linux/amd64 -f Dockerfile.client -t client .

# Admin
docker buildx build --platform linux/amd64 -f Dockerfile.admin -t admin .
```

### 3. Push the images

The images are pushed to the GCP artifact registry. Each image must be tagged with the name of the registry.

```bash
# API
docker tag api us-east1-docker.pkg.dev/polytinder/polytinder-prod/api
docker push us-east1-docker.pkg.dev/polytinder/polytinder-prod/api

# API Admin
docker tag api-admin us-east1-docker.pkg.dev/polytinder/polytinder-prod/api-admin
docker push us-east1-docker.pkg.dev/polytinder/polytinder-prod/api-admin

# Client
docker tag client us-east1-docker.pkg.dev/polytinder/polytinder-prod/client
docker push us-east1-docker.pkg.dev/polytinder/polytinder-prod/client

# Admin
docker tag admin us-east1-docker.pkg.dev/polytinder/polytinder-prod/admin
docker push us-east1-docker.pkg.dev/polytinder/polytinder-prod/admin
```