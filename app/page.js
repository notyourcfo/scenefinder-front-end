"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Upload, LinkIcon, Film, RefreshCw, AlertCircle, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRef, useState } from "react"

export default function Home() {
  const fileInputRef = useRef(null)
  const [videoLink, setVideoLink] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [sceneDetails, setSceneDetails] = useState(null)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [waitlistStatus, setWaitlistStatus] = useState({ type: "", message: "" })

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Handle video/audio file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      setError("Error: Please upload a valid video or audio file (e.g., MP4, MP3)")
      return
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("Error: File size exceeds 5MB limit")
      return
    }

    // Validate video duration (<60s)
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video")
      video.src = URL.createObjectURL(file)
      try {
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            if (video.duration > 60) {
              reject(new Error("Error: Video duration exceeds 60 seconds"))
            } else {
              resolve()
            }
          }
          video.onerror = () => reject(new Error("Error: Invalid video file"))
        })
      } catch (error) {
        setError(error.message)
        return
      }
    }

    setError(null)
    setSceneDetails(null)
    setIsProcessing(true)

    const formData = new FormData()
    formData.append("video", file)

    try {
      const response = await fetch("https://scenefinder-upload-backend.vercel.app/api/upload", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const text = await response.text()
        console.error("Upload API error:", { status: response.status, body: text })
        throw new Error(`Server error: ${response.status} - ${text}`)
      }
      const result = await response.json()
      console.log("Upload API response:", JSON.stringify(result, null, 2))

      // Handle both response structures
      let data
      if (result.success && result.renderResponse?.success) {
        data = result.renderResponse.data
      } else if (result.success && result.data) {
        data = result.data
      } else {
        throw new Error(`Invalid response format: ${JSON.stringify(result, null, 2)}`)
      }

      // Add debug logs to trace data
      console.log("Raw data received:", data);
      console.log("Available fields:", Object.keys(data));

      // Format season and episode
      let seasonAndEpisode = "-"
      if (data.season_and_episode) {
        seasonAndEpisode = data.season_and_episode
      } else if (data.season && data.episode) {
        seasonAndEpisode = `Season ${data.season}, Episode ${data.episode}`
      } else if (data.season) {
        seasonAndEpisode = `Season ${data.season}`
      } else if (data.episode) {
        seasonAndEpisode = `Episode ${data.episode}`
      }

      setSceneDetails({
        movie_or_show: data.movie_or_series || data.title || "-",
        season_and_episode: seasonAndEpisode,
        timestamp: data.timestamp || "-",
        characters: Array.isArray(data.character_names)
          ? data.character_names.join(", ")
          : Array.isArray(data.characters)
            ? data.characters.join(", ")
            : typeof data.character_names === "string"
            ? data.character_names
            : typeof data.characters === "string"
            ? data.characters
            : "-",
        scene_context: data.context_or_summary || data.context_summary || data.scene_context || data.context || "-",
      })
    } catch (error) {
      console.error("Upload error:", error)
      setError(`Error: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Instagram reel link submission via proxy
  const handleLinkSubmit = async () => {
    if (!videoLink.trim()) {
      setError("Error: Please enter a valid Instagram reel link")
      return
    }

    setError(null)
    setSceneDetails(null)
    setIsProcessing(true)

    // Use AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 120s timeout

    try {
      const response = await fetch("/api/proxy-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelUrl: videoLink }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json()
        console.error("Proxy API error:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: data,
        })
        if (response.status === 400) {
          setError(`Error: ${data.error || "Invalid reel URL"}`)
        } else if (response.status === 403 || response.status === 401) {
          setError("Error: Unable to process reel due to server authentication or access issues")
        } else if (response.status === 429) {
          setError("Error: Too many requests, please try again later")
        } else if (response.status >= 500) {
          setError("Error: Server error, please try again later")
        } else {
          setError(`Error: Failed to process reel - ${data.error || response.status}`)
        }
        return
      }

      const result = await response.json()
      console.log("Final API response:", JSON.stringify(result, null, 2))

      // Handle both response structures
      let data
      if (result.success && result.renderResponse?.success) {
        data = result.renderResponse.data
      } else if (result.success && result.data) {
        data = result.data
      } else {
        throw new Error(`Invalid response format: ${JSON.stringify(result, null, 2)}`)
      }

      // Add debug logs to trace data
      console.log("Raw data received:", data);
      console.log("Available fields:", Object.keys(data));

      // Format season and episode
      let seasonAndEpisode = "-"
      if (data.season_and_episode) {
        seasonAndEpisode = data.season_and_episode
      } else if (data.season && data.episode) {
        seasonAndEpisode = `Season ${data.season}, Episode ${data.episode}`
      } else if (data.season) {
        seasonAndEpisode = `Season ${data.season}`
      } else if (data.episode) {
        seasonAndEpisode = `Episode ${data.episode}`
      }

      setSceneDetails({
        movie_or_show: data.movie_or_series || data.title || "-",
        season_and_episode: seasonAndEpisode,
        timestamp: data.timestamp || "-",
        characters: Array.isArray(data.character_names)
          ? data.character_names.join(", ")
          : Array.isArray(data.characters)
            ? data.characters.join(", ")
            : typeof data.character_names === "string"
            ? data.character_names
            : typeof data.characters === "string"
            ? data.characters
            : "-",
        scene_context: data.context_or_summary || data.context_summary || data.scene_context || data.context || "-",
      })
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Link error:", error)
      if (error.name === "AbortError") {
        setError("Error: Request timed out after 120 seconds")
      } else {
        setError(`Error: ${error.message}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setError(null)
    setVideoLink("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Validate email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Handle waitlist submission
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault()
    if (!email || !isValidEmail(email)) {
      setWaitlistStatus({ type: "error", message: "Please enter a valid email address." })
      return
    }
    setIsSubmitting(true)
    setWaitlistStatus({ type: "", message: "" })

    try {
      const response = await fetch(
        "https://api.sheety.co/fb780d0da76b54458e03f37d384563ae/scenefinderWaitlist/sheet1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheet1: { email } }),
        }
      )
      if (!response.ok) {
        const text = await response.text()
        console.error("Sheety API error:", text)
        throw new Error(`Failed to add email to waitlist: ${text}`)
      }
      const result = await response.json()
      console.log("Sheety API response:", JSON.stringify(result, null, 2))
      setWaitlistStatus({
        type: "success",
        message: "Thank you! You've been added to our waitlist.",
      })
      setEmail("")
    } catch (error) {
      console.error("Waitlist error:", error)
      setWaitlistStatus({
        type: "error",
        message: "Error adding your email. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Film className="h-6 w-6" />
            SceneFinder
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary">
              Workflow
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Find Any Movie or TV Scene
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-xl">
              Upload a clip or paste a link to identify the movie, show, or scene details instantly.
            </p>
          </div>
        </section>
        <section className="container mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-6 rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Find Your Scene</h2>
            <p className="text-sm text-muted-foreground">
              Upload a video or audio clip (max 60 seconds, 5MB) or paste a link from Instagram.
            </p>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="video-upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Video or Audio Clip
                </Label>
                <div className="flex items-center justify-center rounded-md border-2 border-dashed p-8 hover:bg-muted/50">
                  <div className="text-center space-y-2">
                    <Film className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag & drop your clip here</p>
                    <p className="text-xs text-muted-foreground">MP4, MP3, max 60 seconds, 5MB</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleButtonClick}
                      disabled={isProcessing}
                    >
                      Select File
                    </Button>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*,audio/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="video-link" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Paste Instagram Reel Link
                </Label>
                <Input
                  id="video-link"
                  placeholder="https://instagram.com/reel..."
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground">Currently supporting Instagram only</p>
              </div>
              <Button onClick={handleLinkSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Identify Scene"
                )}
              </Button>
              {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-600">
                  <p className="mb-2 font-medium">Error:</p>
                  <p className="text-sm">{error}</p>
                  <Button size="sm" variant="outline" onClick={handleReset} className="mt-3">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
          {sceneDetails && (
            <div className="mt-8 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Results</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/preview.jpg"
                    alt="Movie scene preview"
                    width={640}
                    height={360}
                    className="w-full h-full object-cover rounded-md"
                    priority
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Scene Details</h3>
                    <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
                      <span className="font-medium">Movie/Show:</span>
                      <span>{sceneDetails.movie_or_show || "-"}</span>
                      <span className="font-medium">Season/Episode:</span>
                      <span>{sceneDetails.season_and_episode || "-"}</span>
                      <span className="font-medium">Timestamp:</span>
                      <span>{sceneDetails.timestamp || "-"}</span>
                      <span className="font-medium">Characters:</span>
                      <span>{sceneDetails.characters || "-"}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Scene Context</h3>
                    <p className="text-sm text-muted-foreground">
                      {sceneDetails.scene_context || "No context available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className="w-full py-12 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Join Our Waitlist</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Be the first to try new features and updates.
            </p>
            <form onSubmit={handleWaitlistSubmit} className="mx-auto mt-6 max-w-sm flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Join"}
              </Button>
            </form>
            {waitlistStatus.message && (
              <div
                className={`mt-4 flex items-center justify-center gap-2 text-sm ${
                  waitlistStatus.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {waitlistStatus.type === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <p>{waitlistStatus.message}</p>
              </div>
            )}
          </div>
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-muted-foreground">
              We will notify you when we launch. No spam, ever.
            </p>
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