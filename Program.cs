using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace DodgerGameBackend {
    class Program {
        static List<double> scores = new List<double>();
        static string filePath = "scores.json";
        static Random rand = new Random();

        static void Main() { 
            LoadScores();
            bool exit = false;

            while (!exit) {
                Console.Clear();
                Console.WriteLine("=== Dodger Game Backend ===");
                Console.WriteLine("1. Start Game (simulate)");
                Console.WriteLine("2. View High Scores");
                Console.WriteLine("3. Clear Leaderboard");
                Console.WriteLine("4. About Game");
                Console.WriteLine("5. Exit");
                Console.Write("Choose: ");
                string choice = Console.ReadLine();

                switch (choice) {    
                    case "1": StartGame(); break;
                    case "2": ViewScores(); break;
                    case "3": ClearLeaderboard(); break;
                    case "4": AboutGame(); break;
                    case "5": exit = true; break;
                    default: Console.WriteLine("Invalid choice!"); break;
                }
                Console.WriteLine("\nPress Enter...");
                Console.ReadLine();
            }
        }

        static void StartGame() {
            double timeSurvived = Math.Round(rand.NextDouble() * 30, 1); // 0 to 30s
            scores.Add(timeSurvived);
            SaveScores();
            Console.WriteLine($"Game Over! You survived {timeSurvived}s");   
        }

        static void ViewScores() {
            Console.WriteLine("=== High Scores ===");
            if (scores.Count == 0)
            {
                Console.WriteLine("No scores yet.");
                return;
            }

            var topScores = scores.OrderByDescending(s => s).Take(3).ToList();
            for (int i = 0; i < topScores.Count; i++)
            {
                Console.WriteLine($"{i + 1}. {topScores[i]}s");
            }
        }

        static void ClearLeaderboard() {
            scores.Clear();
            SaveScores();
            Console.WriteLine("Leaderboard cleared!");
        }

        static void AboutGame() {
            Console.WriteLine("=== About Dodger Game ===");
            Console.WriteLine("This is the backend system for Dodger Game.");
            Console.WriteLine("Tracks scores and leaderboard.");
            Console.WriteLine("Version: 1.0");
        }

        static void SaveScores() {
            File.WriteAllText(filePath, JsonSerializer.Serialize(scores));
        }

        static void LoadScores() {
            if (File.Exists(filePath)) {
                scores = JsonSerializer.Deserialize<List<double>>(File.ReadAllText(filePath));
            }
        }
    }
}