import { Button } from "@/components/ui/button"
import { Upload, Search, Info, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            SceneFinder
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Button size="sm">
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">How It Works</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-xl">
              Identify any movie or TV scene in three simple steps
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Step 1: Upload or Link</h3>
                <p className="text-muted-foreground">
                  Upload a short clip (max 60 seconds) or paste a link from Instagram.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Step 2: Scene Detection</h3>
                <p className="text-muted-foreground">
Our tool transcribes the dialogue and identifies the matching movie or TV show scene using advanced AI.                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Info className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Step 3: Get Results</h3>
                <p className="text-muted-foreground">
                  View the movie/show name, episode details, and scene context instantly.
                </p>
              </div>
            </div>
            <Button size="lg" className="mt-12" asChild>
              <Link href="/">Try It Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SceneFinder. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
