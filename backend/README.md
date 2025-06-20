<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<!-- Badges -->
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# Launchpad Backend

A scalable, modular backend for the Launchpad platform, built with [NestJS](https://nestjs.com/) and TypeScript. This service powers authentication, memecoin management, user operations, and coin creation, with a focus on performance and maintainability.

---

## 🚀 Features
- Modular architecture (NestJS)
- JWT-based authentication
- Memecoin creation and management
- User registration and portfolio
- Coin publishing and tracking
- Integrated testing (unit, integration, e2e)

## 🗂️ Folder Structure

```
backend/
  src/
    auth/           # Authentication (JWT, guards, strategies)
    coin-creator/   # Coin creation logic and config
    common/         # Shared decorators, filters, interceptors
    memecoins/      # Memecoin endpoints, schemas, services
    users/          # User management (CRUD, schemas)
    main.ts         # App entry point
  test/             # e2e and integration tests
  package.json      # Dependencies and scripts
  jest*.js          # Jest configs
  tsconfig*.json    # TypeScript configs
```

## ⚙️ Environment Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment variables:**
   - Create a `.env` file in `backend/` (if not present).
   - Required variables (example):
     ```env
     JWT_SECRET=your_jwt_secret
     DB_URI=mongodb://localhost:27017/launchpad
     PORT=3000
     ```
   - See `src/coin-creator/config/env.validation.ts` for validation schema.

## 🏃‍♂️ Running the Project

- **Development:**
  ```bash
  npm run start:dev
  ```
- **Production:**
  ```bash
  npm run start:prod
  ```
- **Testing:**
  ```bash
  npm run test         # Unit tests
  npm run test:e2e     # End-to-end tests
  npm run test:cov     # Coverage
  ```

## 📖 API Usage

- The API runs by default at `http://localhost:3000`.
- Example endpoints:
  - `POST /auth/register` – Register a new user
  - `POST /auth/login` – Login and receive JWT
  - `GET /memecoins` – List all memecoins
  - `POST /coin-creator` – Create a new coin
  - `GET /users` – List users (admin only)

Use Swagger or Postman for API exploration (Swagger setup recommended for future versions).

## 🚦 Performance & Production Tips
- Use `npm run start:prod` for optimized builds
- Enable caching for heavy endpoints (see NestJS [cache docs](https://docs.nestjs.com/techniques/caching))
- Use async/await for all DB and network operations
- Monitor memory and CPU usage in production
- Consider clustering (Node.js cluster or PM2) for multi-core scaling
- Validate environment variables strictly

## 🤝 Contributing
- Fork and clone the repo
- Create feature branches for changes
- Run tests before submitting PRs
- Follow code style (see `.eslintrc.js` and `.prettierrc`)

## 📚 Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [Deployment Guide](https://docs.nestjs.com/deployment)
- [Discord Community](https://discord.gg/G7Qnnhy)

## 📝 License & Credits
- Author: [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- License: [MIT](https://github.com/nestjs/nest/blob/master/LICENSE)
- Based on the official [NestJS starter](https://github.com/nestjs/nest)
