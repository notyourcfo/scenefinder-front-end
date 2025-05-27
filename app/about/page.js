import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function About() {
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
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8">
              About SceneFinder
            </h1>
            <div className="mx-auto max-w-3xl rounded-lg border p-8">
              <p className="text-muted-foreground mb-4">
                SceneFinder helps movie lovers and content creators instantly identify scenes from short clips or shared links. Whether its a nostalgic line, an iconic moment, or a viral video youre curious about - we help you find out exactly where it came from. No need to scroll through episodes or forums. Just drop a clip and let our AI do the rest.
              </p>
              <p className="text-muted-foreground">
                Built by fans, for fans - we are focused on simplifying discovery through the power of machine learning and a love for storytelling.
              </p>
              <div className="mt-6 flex items-center gap-2 border-t pt-6">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Have feedback? Contact us at{" "}
                  <a href="mailto:usef@techhustlr.space" className="text-primary hover:underline">
                    usef@techhustlr.space
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link href="/">Try SceneFinder <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
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