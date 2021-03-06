# MERN App Template

This template includes a basic user model for MongoDB and REST endpoints for CRUD operations on it. It uses JWT for authentication.

---

### Scripts

`dev` : run nodemon to watch for changes (see nodemon.json)

`build`: webpack build with production mode config

`start`: start the server in production mode

---

### User Model:

| Field           | Type    | Description                                          | Required | Unique |
| --------------- | ------- | ---------------------------------------------------- | -------- | ------ |
| name            | string  | Store the user's name                                | Yes      | No     |
| email           | string  | The user's email - only one account per unique email | Yes      | Yes    |
| hashed_password | string  | The user's password hash                             | Yes      | No     |
| salt            | string  | The user's unique salt for the hashing algorithm     | Yes      | No     |
| \*isAdmin       | boolean | Is this user an admin (default=false)                | Yes      | No     |
| created         | Date    | Timestamp of account creation                        | Yes      | No     |
| updated         | Date    | Timestamp of account's details update                | Yes      | No     |

## \* Not yet implemented

---

### API endpoints for user CRUD

| Operation            | API Route          | HTTP Method | Access       |
| -------------------- | ------------------ | ----------- | ------------ |
| Create User          | /api/users         | POST        | All          |
| List all Users       | /api/users         | GET         | Admin        |
| Fetch a user by id   | /api/users/:userId | GET         | User & Admin |
| Update an user by id | /api/users/:userId | PUT         | User & Admin |
| Delete an user by id | /api/users/:userId | DELETE      | User & Admin |
| User sign-in         | /auth/signin       | POST        | User         |
| User sign-out        | /auth/signout      | GET         | User         |

---

### Front-end

The front end has the following features:

- Home page
- Sign-up page
- Sign-in page
- User list page
- Profile page
- Edit profile page
- Navigation bar & menu
- Delete user component
- Main Router component

### Server-side rendering

The app includes basic server-side rendering
