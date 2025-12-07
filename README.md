
# Dodger Game Backend (Web Version)

This is the **ASP.NET Core backend** for Dodger Game. It serves a web-based frontend (`index.html`) and provides REST APIs for authentication, game data, and leaderboard management.

## Tech Stack
- **Language:** C#
- **Framework:** .NET 10 SDK (Preview)
- **Backend:** ASP.NET Core Web API
- **Database:** SQLite (via Entity Framework Core)
- **Authentication:** JWT (JSON Web Tokens)
- **Tools:** Visual Studio Code, Git, Swagger

## Features
- Serve frontend from `wwwroot/index.html`
- JWT-based authentication
- SQLite database for persistent scores
- Swagger API documentation
- CORS enabled for cross-origin requests

## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/addania-git/backend-project.git
   cd backend-project
