# PolyTinder

## Pushing images

### 1. Download and encode the key

On GCP, [download a Service Account key in JSON format](https://cloud.google.com/iam/docs/keys-create-delete), and save as in `.auth/auth.json`. Make sure the selected Service Account has the necessary permissions to push to the Artifact Registry.

Run the following command to encode it:

```bash
base64 .auth/auth.json > .auth/auth64.txt
```

### 2. Login into the registry

```bash
cat .auth/auth64.txt | docker login -u _json_key_base64 --password-stdin northamerica-northeast1-docker.pkg.dev
```

### 3. Push the image

#### API
```bash
# Build
docker build -f Dockerfile.api -t api .
# Build (for ARM based computer)
docker buildx build --platform linux/amd64 -f Dockerfile.api -t api .

# Tag
docker tag api northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/api

# Push
docker push northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/api
```

#### API Admin
```bash
# Build
docker build -f Dockerfile.api-admin -t api-admin .
# Build (for ARM based computer)
docker buildx build --platform linux/amd64 -f Dockerfile.api-admin -t api-admin .

# Tag
docker tag api-admin northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/api-admin

# Push
docker push northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/api-admin
```

#### Client
```bash
# Build
docker build -f Dockerfile.client -t client .
# Build (for ARM based computer)
docker buildx build --platform linux/amd64 -f Dockerfile.client -t client .

# Tag
docker tag client northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/client

# Push
docker push northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/client
```

#### Admin
```bash
# Build
docker build -f Dockerfile.admin -t admin .
# Build (for ARM based computer)
docker buildx build --platform linux/amd64 -f Dockerfile.admin -t admin .

# Tag
docker tag admin northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/admin

# Push
docker push northamerica-northeast1-docker.pkg.dev/polytinder/polytinder-prod/admin
```