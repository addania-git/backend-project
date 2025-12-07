# Dodger Game Backend (Web Version)

This is the **ASP.NET Core backend** for Dodger Game. It now serves a web-based frontend (`index.html`) and provides REST APIs for authentication, game data, and leaderboard management.

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
   ```

2. Restore dependencies:
   ```bash
dotnet restore
   ```

3. Apply EF migrations:
   ```bash
dotnet ef database update
   ```

4. Run the backend:
   ```bash
dotnet run
   ```

5. Open the frontend:
   Navigate to:
   ```
http://localhost:5000/index.html
   ```

## API Documentation
Swagger UI is available at:
```
http://localhost:5000/swagger
```

## Project Structure
- `GameDataManager.csproj` – Project configuration file.
- `Program.cs` – Main entry point for the backend logic.
- `Controllers/` – API endpoints for authentication and scores.
- `Data/` – EF Core DbContext and migrations.
- `Models/` – Entity models.
- `Services/` – JWT token generation and related services.
- `wwwroot/` – Frontend files (index.html, CSS, JS).
