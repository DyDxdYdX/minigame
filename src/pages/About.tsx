import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Gamepad2, Users, Heart, Trophy } from "lucide-react";

function About() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto py-12 px-4">
      <div className="w-full space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">About Minigame</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-center">
              <strong>Minigame</strong> is your go-to destination for quick, fun, and completely free mini-games. Our mission is to provide a delightful gaming experience for everyone—no payments, no ads, just pure entertainment!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <Gamepad2 className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Free Gaming</h3>
                <p className="text-muted-foreground">Enjoy a variety of games without any cost or ads</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <Users className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">For Everyone</h3>
                <p className="text-muted-foreground">Games designed for players of all ages and skill levels</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <Heart className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Made with Love</h3>
                <p className="text-muted-foreground">Crafted with passion for the gaming community</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What types of games are available?</AccordionTrigger>
                <AccordionContent>
                  We offer a diverse collection of quick, engaging single-player mini-games that are perfect for short gaming sessions. From puzzle games to action-packed challenges, there's something for everyone.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is Minigame really free?</AccordionTrigger>
                <AccordionContent>
                  Yes! Minigame is completely free to play. We believe in providing accessible entertainment without any hidden costs or advertisements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I play the games?</AccordionTrigger>
                <AccordionContent>
                  Simply visit our website, choose a game from our collection, and start playing instantly in your browser. No downloads or installations required!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How often are new games added?</AccordionTrigger>
                <AccordionContent>
                  We regularly update our game collection with new titles. Stay tuned to our platform for the latest additions and updates!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Trophy className="w-8 h-8 text-primary" />
              <p className="text-muted-foreground">
                Whether you have a few minutes to spare or want to challenge yourself, Minigame offers a variety of fast-paced single-player games designed for all ages. We believe in keeping things simple, accessible, and enjoyable.
              </p>
            </div>
            <p className="text-muted-foreground text-center">
              Thank you for being part of our community. Have fun and let the games begin!
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default About; 