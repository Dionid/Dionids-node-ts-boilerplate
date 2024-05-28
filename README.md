# Dionid's Node.ts Boilerplate (DNB)

# Setup

- `npm i`

- `docker-compose up -d`

- Database

  - `cd databases/main-pg`
  - `cp .env.example .env`
  - `npm run migration:up`
  - `npm run fixture:up`

- Common lib

  - `cd libs/common`
  - `npm run introspect:main-pg`
  - `npm run build`
    – (vscode) reload window

# Features

- Monorepo
- FALS
- Modular monolith
- Distributed Functions (RPC + EDA)
- Branded types
- Typed Errors
- FOP architecture
- FDD patterns
- Migration-first aproach
- Logs, Metrics and Tracing

# Dictionary

- Project – ...
- Service – ...
- Application – ...

# Evolution

## TODO

1. Do something with Docker
1. Add stub fixture
1. Add all needed libs
1. ...

## Step 1 – Basics

1. ~~Add migrations~~
1. ~~Introspect~~
1. ~~Add kysely~~
1. ~~Extend schema with branded types~~
1. ~~Extend schema with kysely~~
1. ~~Create RPCs on zod in libs/common~~
1. ~~Create service from template~~
1. ~~Create features: SignIn, SignUp, SendEmail~~
1. ~~Create application in service~~
1. ~~Add to http gateway~~

## Step ... – Api Schema

1. ~~Add protobuf to `libs/proto`~~
1. ~~Generate gRPC~~
1. ~~Generate swagger~~
1. ~~Add to `DoDo`~~
1. ~~Graceful shutdown for gRPC~~
1. ~~Add error middleware~~
1. ~~Run~~
1. Add auth middleware and check
1. Add client
1. Dockerfile

## Step ... – Modularity

1. Create new app for partner api
1. Add cron app
1. Create script
1. Move features to `/apps`

## Step ... – Microservices

1. Move SendEmail to different service
1. Add gRPC communication

## Step ... – EDA inmemory

1. Add Events
1. Add InmemoryTransport

## Step ... – EDA on Kafka

1. Add Events
1. Add Kafka

## Step ... – HTTP API

1. Add HTTP API ontop of gRPC openapi export

# Stack

- Node.js 16
- TypeScript 4.9
- PG 14
- Redis
- Kafka
- Docker

# Project structure

- `/.git`
- `/.gitlab` – CI/CD config
- `/.husky` – git hooks
- `/databases/main-pg` – main PG database
- `/libs/common` – common libs between local applications
- `/.cspell.json` – spell checker config
- `/.dockerignore` – docker ignore
- `/.eslintignore` – eslint ignore
- `/.eslintrc.js` – eslint config
- `/.gitignore` – git ignore
- `/.gitlab-ci.yml` – CI/CD config
- `/.npmrc` – npm config
- `/.nvmrc` – node version
- `/.pretterignore` – prettier ignore
- `/.prettierrc.js` – prettier config
- `/.releaserrc.json` – semantic release config
- `/.commitlintrc.js` – commitlint config
- `/.cspell-ext.json` – spell checker config
- `/.docker-compose.app.yml` – docker compose for applications
- `/.docker-compose.extra.yml` – docker compose for extra services
- `/.docker-compose.yml` – docker compose config
- `/Dockerfile` – main docker file
- `/Dockerfile.base` – main docker file base
- `/Dockerfile.template` – main docker file template
- `/jest.config.int.json` – jest integration tests config
- `/jest.config.unit.json` – jest unit tests config
- `/lerna.json` – lerna config
- `/nx.json` – nx config
- `/package.json` – main package.json
- `/tsconfig.json` – main tsconfig

More info in `/${app}/README.md`

# Application structure

- `/dist` – compiled code
- `/node_modules` – node modules
- `/src` – source code
  - `/apps` – combination of features, libs and other code to start application as service or cron
  - `/features` – business logic
  - `/libs` – libs for this application
  - `/scripts` – folder for scripts
  - `/tests` – tests config folder

# Where to put lib code

- `/libs/common` – if it will be used in any application
- `<app>/src/libs` – if it will be used only in this application
- `*/libs/@dntb/*` – if it is project specific code

# Architecture

## Branded types

Types that will be checked in runtime and compile time like `UInt32`, `Email`, `ControllerSerialNumber`.

## FOP

https://fop.davidshekunts.ru/

## FDD

https://fdd.davidshekunts.ru/

## Logs, Metrics and Tracing

- pino + Loki + Grafana – for logs
- opentelemetry + Prometheus + Grafana – for metrics
- opentelemetry + Tempo + Grafana – for tracing

# How to add Feature

# How to create application

- Create new application in `${application}/src/apps` (use other application as example)
- Add `index.ts` and `config.ts`
- Go to `${application}/package.json` and add new application to `scripts`

# Deploy

- Create MR
- Merge to `development`
- Test in development (with QA engineer)
- Create MR to `main`
- Merge to `main`
