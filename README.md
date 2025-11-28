# Dodger Game Backend
This is the backend system for Dodger Game. It tracks scores, shows high scores, and provides a simple game menu.

## Features
- Start Game (simulate survival time)
- View High Scores (Top 3)
- Clear Leaderboard
- About Game

## Requirements
- .NET 10 SDK

## Project Structure
- `GameDataManager.csproj` – Project configuration file.
- `Program.cs` – Main entry point for the backend logic.

## How to Run
- Open the folder in VSCode. In your terminal:

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
