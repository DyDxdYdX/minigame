import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Puzzle, Grid, Gamepad2 } from "lucide-react";

function Games() {
  const games = [
    {
      id: "sudoku",
      title: "Sudoku",
      description: "Challenge your logical thinking with this classic number puzzle game. Fill the 9x9 grid following the rules of Sudoku.",
      icon: Grid,
      difficulty: "Easy, Medium, Hard",
      category: "Puzzle"
    },
    {
      id: "minesweeper",
      title: "Minesweeper",
      description: "Test your deduction skills in this classic game. Clear the board without hitting any mines! Three difficulty levels available.",
      icon: Gamepad2,
      difficulty: "Beginner, Intermediate, Expert",
      category: "Strategy"
    },
    {
      id: "sliding-puzzle",
      title: "Sliding Puzzle",
      description: "Arrange the numbered tiles in order by sliding them into the empty space. A timeless puzzle challenge!",
      icon: Puzzle,
      difficulty: "Medium",
      category: "Puzzle"
    }
  ];

  return (
    <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto py-12 px-4">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Available Games</h1>
          <p className="text-muted-foreground text-lg">
            Choose from our collection of free, browser-based games
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <game.icon className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>{game.title}</CardTitle>
                    <CardDescription>{game.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{game.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Difficulty:</span>
                  <span>{game.difficulty}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/games/${game.id}`}>Play Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center text-muted-foreground mt-8">
          <p>More games coming soon! Stay tuned for updates.</p>
        </div>
      </div>
    </main>
  );
}

export default Games; 