# GitHub Account Viewer

This project is built using Next.js for the frontend and Go Fiber for the backend, and it leverages various technologies and APIs, including GitHub OAuth2, Firebase for data storage, and Google Cloud Run for deployment.

## Key Features

1. **User Authentication with OAuth2 and JWT**: Securely log in with your GitHub account using OAuth2 authentication, and enjoy a personalized experience with JWT token-based authentication.

2. **Profile Details**: View your own GitHub profile details, including your repositories, followers, and following, as well as the profiles of other GitHub users.

3. **Responsive Design**: The application is designed to work seamlessly on various devices, ensuring a great user experience on both desktop and mobile.

4. **GitHub Actions for CI**: Continuous Integration (CI) is set up using GitHub Actions, which automates the testing and deployment process, ensuring reliability and easy updates.

5. **Deployment on Google Cloud Run**: The project is deployed on Google Cloud Run, providing scalability and reliability for your application.

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Redux Toolkit
- Tailwind CSS

### Backend
- Golang
- Go Fiber
- Firebase (Database)

## Getting Started - Frontend

### Preparation
1. Copy the `.env.example` file and rename it to `.env.local`.
2. Update `NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID` in the `.env.local` file with your GitHub OAuth Client ID.

### Run the Project
1. Run `npm install` to install the project dependencies.
2. Run `npm run dev` to start the development server.

## Getting Started - Backend

### Preparation
1. Copy the `.env.example` file and rename it to `.env`.
2. Update the following variables in the `.env` file:
   - `GITHUB_OAUTH_CLIENT_ID`: Your GitHub OAuth Client ID.
   - `GITHUB_OAUTH_CLIENT_SECRET`: Your GitHub OAuth Client Secret.
   - `JWT_SECRET`: A secret key for JWT token generation.
3. Copy `serviceAccount.dev.example.json` file and rename it to `serviceAccount.dev.json`. Update the `serviceAccount.dev.json` content with your Firebase project's service account credentials.

### Running the Backend Project
1. Run `go get -d -v ./...` to download and install the project dependencies.
2. Run `go install -v ./...` to build and install the backend application.
3. Run `go run api/main.go` to start the backend server.

## GitHub API Used

- [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub API to Get a User Profile](https://docs.github.com/en/free-pro-team@latest/rest/users/users?apiVersion=2022-11-28#get-a-user)
- [GitHub API to Get Repositories of a User](https://docs.github.com/en/free-pro-team@latest/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)
- [GitHub API to Get Repositories of the Authenticated User](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)

## Live Demo

Try out the live demo at [GitHub Account Viewer Demo](https://testing-deploying-fe-vnpeqjkogq-as.a.run.app).

---

This project is licensed under the [MIT License](LICENSE).
