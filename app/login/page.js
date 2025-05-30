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
              <Link href="/">home</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8">
             Enjoy it :)
            </h1>
            <div className="mx-auto max-w-3xl rounded-lg border p-8">
              <p className="text-muted-foreground mb-4">
              No need to log in just enjoy the features. 
              </p>
              <p className="text-muted-foreground">
                Glad that you took an effort to navigate this page if you wanna be updated with our upcoming tools and feature probably subscribe to waitlist and would appreciate if u leave a feedback.
              </p>
              <div className="mt-6 flex items-center gap-2 border-t pt-6">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  leave your feedback here in this mail{" "}
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
