# API

This packages contains the code for the API and the API Admin packages.

## 🌲 Project structure

```
.
│
├── api/
│   ├── config/                         # Configuration files
│   ├── migrations/                     # Database migrations files (See Database section)
│   ├── public/                         # Public files
│   ├── seeds/                          # Database seeds files (See Database section)
│   ├── src/
│   │   ├── configs/                    # Execution config
│   │   ├── constants/                  # Constants
│   │   ├── controllers/                # Defines the endpoints of the API
│   │   ├── middlewares/                # HTTP server middlewares
│   │   ├── models/                     # Package specific interfaces
│   │   ├── services/                   # Services
│   │   │   ├── admin-service           # Admin services
│   │   │   ├── admin-user-service      # Admin services for users
│   │   │   ├── authentication-service  # Authentication
│   │   │   ├── database-service        # Database
│   │   │   ├── matching-service        # Matching (swiping, matching, etc.)
│   │   │   ├── messages-service        # Messages
│   │   │   ├── moderation-service      # Moderation (reports, suspensions, bans, etc.)
│   │   │   ├── public-profile-service  # Public profile (find users, etc.)
│   │   │   ├── user-alias-service      # User aliases (abanonded)
│   │   │   ├── user-deletion-service   # User deletion
│   │   │   ├── user-profile-service    # User profile (edit profile, etc.)
│   │   │   ├── user-validation-service # User validation (email, profile completed, etc.)
│   │   │   ├── ws-service              # Websocket
│   │   ├── types/                      # Package specific types
│   │   ├── utils/                      # Utility functions
│   │   ├── app-admin.ts                # Express app for the Admin API
│   │   ├── app.ts                      # Express app for the API
│   │   ├── index-admin.ts              # Entry point for the Admin API
│   │   ├── index.ts                    # Entry point
```

## 💽 Database

The database is a MySQL database and is managed using [KnexJS](https://knexjs.org/).

Knex is used to create migration, seeds and to query the database.