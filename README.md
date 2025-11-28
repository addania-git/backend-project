# Dodger Game Backend
This is the backend system for Dodger Game. It tracks scores, shows high scores, and provides a simple game menu.

## Tech Stack
- **Language:** C#
- **Framework:** .NET 10 SDK
- **Tools:** Visual Studio Code, Git

## Project Structure
- `GameDataManager.csproj` – Project configuration file.
- `Program.cs` – Main entry point for the backend logic.

## Features
- Start Game (simulate survival time)
- View High Scores (Top 3)
- Clear Leaderboard
- About Game

## How to Run
Open the Program.cs in VSCode. In your terminal:

1. Navigate to the project folder:
   ```bash
   cd GameDataManager
2. (Optional) Clean previous builds:
   ```bash
   dotnet clean
3. Build project:
   ```bash
   dotnet build
4. Run the backend:
   ```bash
   dotnet bin\Debug\net10.0\GameDataManager.dll

## Menu Options
![Game Menu](assets/menu-screenshot.png)

1. **Start Game (simulate)**  
   Simulates a game session and records a survival time score.

2. **View High Scores**  
   Displays the top 3 scores from the leaderboard.

3. **Clear Leaderboard**  
   Removes all saved scores from the leaderboard.

4. **About Game**  
   Shows information about the Dodger Game backend.

5. **Exit**  
   Closes the application.
   
