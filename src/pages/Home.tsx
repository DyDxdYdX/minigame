import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { SEOHead, seoConfigs } from "@/components/seo-head"

function Home() {
  return (
    <>
      <SEOHead {...seoConfigs.home} />
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto py-12 px-4">
      <section className="text-center space-y-6 mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to minigame
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the thrill of our collection of exciting mini-games.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild><Link to="/games">Start Playing</Link></Button>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Quick Games</CardTitle>
            <CardDescription>Fast-paced games for quick fun</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Jump into action-packed mini-games that'll keep you on your toes! Perfect for those quick gaming sessions when you need a burst of excitement.
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Completely Free</CardTitle>
            <CardDescription>No need to pay for anything</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unlock endless entertainment without spending a dime! Every game, every feature, and every update is yours to enjoy completely free.
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>No Ads</CardTitle>
            <CardDescription>No annoying ads</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Immerse yourself in pure gaming bliss with zero interruptions. Your gaming experience stays clean, focused, and ad-free.
            </p>
          </CardContent>
        </Card>
      </section>
      </main>
    </>
  )
}

export default Home 