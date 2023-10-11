# API

This packages contains the code for the API and the API Admin packages.

## 🗂️ Services

Services are separated in two categories. The first one is the public services, which are used by the API. The second one is the admin services, which are used by the API Admin.

It is to be noted that admin controllers also use public services. But the public controllers should never use admin services.

### Admin services

#### Admin reports service ([admin-reports-service.ts](./src/services/admin-reports-service/admin-reports-service.ts))

This service is used to manage reports on an admin level.

| Method | Description |
| --- | --- |
| `getReports()` | Get all reports |

#### Admin service ([admin-service.ts](./src/services/admin-service/admin-service.ts))

This service is used to manage admins on an admin level.

| Method | Description |
| --- | --- |
| `isAdmin()` | Check if a user is an admin |

#### Admin users service ([admin-users-service.ts](./src/services/admin-users-service/admin-users-service.ts))

This service is used to manage users on an admin level.

| Method | Description |
| --- | --- |
| `listUsers()` | Get all users |
| `getSuspensionsForUser()` | Get all suspensions for a user |
| `getBansForUser()` | Get all bans for a user |
| `getReportsForUser()` | Get all reports for a user |
| `suspendUser()` | Suspend a user |
| `banUser()` | Ban a user |
| `revokeSuspension()` | Set all active suspensions expiration to now |
| `unbanUser()` | Unban a user |

### Public services

#### Authentication service ([authentication-service.ts](./src/services/authentication-service/authentication-service.ts))

This service is used to manage authentication (login/signup/sessions).

| Method | Description |
| --- | --- |
| `signup()` | Signup a user |
| `login()` | Login a user |
| `loadSession()` | Create session from token and refreshes it |
| `logout()` | Logout a user |
| `logoutAll()` | Logout all sessions of a user |
| `requestPasswordReset()` | Creates a password reset request and send an email to the user |
| `resetPassword()` | Reset the password of a user |
| `comparePassword()` | Compare a password with a hash |

#### Database service ([database-service.ts](./src/services/database-service/database-service.ts))

This service is used to connect to the database.

| Method | Description |
| --- | --- |
| `instantiate()` | Connect to the database and migrate database if needed |
| `isConnected()` | Check if the database is connected |

#### Email service ([email-service.ts](./src/services/email-service/email-service.ts))

This service is used to send emails.

| Method | Description |
| --- | --- |
| `sendEmail()` | Send an email |

#### Matching service ([matching-service.ts](./src/services/matching-service/matching-service.ts))

This service is used to manage matching (swiping and matching).

| Method | Description |
| --- | --- |
| `swipe()` | Like or dislike a user. Triggers a match if needed |
| `unmatchUser()` | Unmatch a user |
| `areMatched()` | Check if two user are matched |

#### Messages service ([messages-service.ts](./src/services/messages-service/messages-service.ts))

This service is used to manage sending and receiving chat messages.

| Method | Description |
| --- | --- |
| `sendMessage()` | Send a message to a user |
| `getMessages()` | Get all messages between two users |
| `markAsRead()` | Mark conversation as read for a user |

#### Moderation service ([moderation-service.ts](./src/services/moderation-service/moderation-service.ts))

This service is used to manage moderation (reports, suspensions, bans, etc.).

| Method | Description |
| --- | --- |
| `reportUser()` | Report a user |
| `blockUser()` | Block a user |
| `isBlocked()` | Check if two users are blocked |
| `isBannedOrSuspended()` | Get if a user is banned or suspended |
| `isEmailBannedOrSuspended()` | Get if an email is banned or suspended |

#### Public profile service ([public-profile-service.ts](./src/services/public-profile-service/public-profile-service.ts))

This service is used to manage fetching profiles of other users (get users for swiping, get matches, etc.).

> **Note:** The scope of this service isn't well defined yet. It could be moved/split into dedicated services for swiping and matching.

| Method | Description |
| --- | --- |
| `findUser()` | Get the profile of a user from its ID only if the requesting user can see it |
| `getAvailableUsers()` | Get the list of users available for swiping |
| `getMatches()` | Get the list of matches of a user |

#### User alias service ([user-alias-service.ts](./src/services/user-alias-service/user-alias-service.ts))

This service is used to manage user aliases (abandoned). 

This service is ment to create temporary users id to prevent users to know the real id and creating false requests. For simplicity, this service was abandoned but has been kept in case it is needed in the future.

| Method | Description |
| --- | --- |
| `createAlias()` | Create an alias for a user |
| `getUserId()` | Get the user id from an alias |

#### User deletion service ([user-deletion-service.ts](./src/services/user-deletion-service/user-deletion-service.ts))

This service is used to manage user deletion.

| Method | Description |
| --- | --- |
| `deleteUser()` | Delete a user |

#### User profile service ([user-profile-service.ts](./src/services/user-profile-service/user-profile-service.ts))

This service is used to manage a user's own profile (edit profile, etc.).

| Method | Description |
| --- | --- |
| `initUserProfile()` | Creates an empty entry for a user |
| `getUserProfile()` | Get the profile of a user |
| `setUserProfile()` | Set the profile of a user |

#### User service ([user-service.ts](./src/services/user-service/user-service.ts))

This service is used to manage users.

| Method | Description |
| --- | --- |
| `getUser()` | Get a user |

#### User validation service ([user-validation-service.ts](./src/services/user-validation-service/user-validation-service.ts))

This service is used to manage user validation (email, profile completed, etc.).

| Method | Description |
| --- | --- |
| `fetchValidation()` | Get the validation status of a user |
| `createUserValidation()` | Create a validation entry for a user |
| `isUserValid()` | Check if all validations are valid for a user |
| `setUserProfileReady()` | Set the profile completed validation to true |
| `requestEmailValidation()` | Request an email validation for a user |
| `validateEmail()` | Validate an email |

#### Verification token service ([verification-token-service.ts](./src/services/verification-token-service/verification-token-service.ts))

This service is used to manage verification tokens (email, password reset, etc.).

| Method | Description |
| --- | --- |
| `generateToken()` | Generate a token |
| `validateToken()` | Verify a token |

#### Websocket service ([ws-service.ts](./src/services/ws-service/ws-service.ts))

This service is used to manage websocket connections.

| Method | Description |
| --- | --- |
| `instantiate()` | Initialize the websocket server |
| `registerAuthenticationValidation()` | Register the validation function for authentication on socket connection |
| `connectClient()` | Add an entry to the connected socket map |
| `disconnectClient()` | Remove an entry from the connected socket map |
| `emit()` | Emit an event to all sockets |
| `emitToUser()` | Emit an event to a user (will throw if user is not connected) |
| `emitToUserIfConnected()` | Emit an event to a user (non breaking if user is not connected) |

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