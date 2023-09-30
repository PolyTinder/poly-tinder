# Base Typescript Server

This is a base for a ExpressJS server build using Typescript that is already configured to use within Docker.

## 🚀 Start the project

This project can be started with npm or with Docker. Docker is prefered as you make sure you are always in the same environment, however, npm can be simpler for certain.

### 🐋 With Docker

#### 🛠️ Development

This will start the development container. It will run in Docker and attached to your console.

1. Install the dependencies with `npm install`
2. Run `make dev`

#### 🚢 Production

This will build and start de production container.

1. Run `make run`

### 🎮 With npm

#### 🛠️ Development

1. Install the dependencies with `npm install`
2. Run `npm run dev`

#### 🚢 Production

1. Install the dependencies with `npm ci --production`
2. Run `npm start`