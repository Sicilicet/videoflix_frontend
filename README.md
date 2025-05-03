# Project overview

This frontend provides a user interface to play videos, registrate, login, logout, send verification emails and password reset
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.3.

## System Requirements

- Node.js (v16 or later)
- Angular CLI (v17.1.3)
- A compatible browser (latest version of Chrome, Firefox, etc.)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sicilicet/videoflix_frontend
cd videoflix-frontend
npm install
```

## Project Structure

- `src/app/features/auth/` - Contains all UI components for authentication.
- `src/app/features/features/` - Contains all UI components for video display.
- `src/app/interfaces/` - Contains interfaces.
- `src/app/models/` - Contains models.
- `src/app/services/` - Contains services for interacting with APIs.
- `src/app/services/guards` - Contains the route guards for routes.ts.
- `src/app/shared` - Contains all shared UI components, e.g. header.
- `src/app/static` - Contains all static UI components, e.g. the imprint.
- `src/app/utils` - Contains utlity functions.
- `src/environments/` - Contains environment configuration files.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Usage

- **Playing Videos**: Navigate to the video library and select a video to start streaming.
- **User Registration**: Create a new account by clicking on "Sign up" and filling in the required fields.
- **Email verification**: Click on the link in the email and you will be directed to the verification page which verifies the email address automatically.
- **Password Reset**: Click on "Forgot Password" to initiate the password reset process. An email will be sent which directs the user to the password reset page.
- **Login**: Login with email and password to receive a token for authentication.

## Environment variables

Configure the environment variables in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://", // Set the backend API URL here
};
```

## API Integration

This frontend communicates with a backend API for user authentication, video streaming, and other features.
Ensure that the backend server is running at the URL specified in `environment.ts` to connect successfully.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployment

To deploy the frontend application, build the project and host the files in the `dist/` directory on your preferred platform.

Example for building:

```bash
ng build --prod
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
