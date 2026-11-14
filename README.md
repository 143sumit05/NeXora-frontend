# NeXora — Frontend

**Connect. Collaborate. Grow.**

The frontend of NeXora, a developer networking platform built to help developers discover people, build professional connections, and interact through a unified interface.

## Project Overview

NeXora provides a platform where developers can create profiles, discover other developers, manage connection requests, and interact with the developer community.

## Features

- User authentication and account management
- Developer profile management
- Developer discovery and feed
- Sending and managing connection requests
- Responsive user interface
- Redux-based application state management
- API integration with the NeXora backend
- Socket.IO client integration

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| Vite | Development server and build tool |
| Redux Toolkit | State management |
| React Router | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS 4 | Styling |
| DaisyUI 5 | UI components |
| Socket.IO Client | Real-time communication |

## Project Structure

```text
NeXora-frontend/
├── public/
├── src/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/143sumit05/NeXora-frontend.git
cd NeXora-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Configure the backend API URL using the environment variable expected by the frontend API configuration.

Refer to the project's existing API configuration for the exact variable name.

### 4. Start the development server

```bash
npm run dev
```

### 5. Create a production build

```bash
npm run build
```

## Related Repository

The backend REST API is maintained separately:

[NeXora Backend](https://github.com/143sumit05/NeXora-backend)

## Main Project

[NeXora — Central Repository](https://github.com/143sumit05/NeXora)

## Author

**Sumit Dhiman**

[GitHub Profile](https://github.com/143sumit05)