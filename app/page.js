"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Upload, LinkIcon, Film, RefreshCw, AlertCircle, Mail, CheckCircle, Search } from "lucide-react"
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

    // Validate Instagram link
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/?.*$/;
    if (!instagramRegex.test(videoLink)) {
      setError("Error: Only Instagram reel links are supported")
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold gradient-text">
            <Film className="h-6 w-6" />
            SceneFinder
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href="/how-it-works" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Workflow
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Button size="sm" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Find Any Movie or TV Scene
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the source of your favorite movie and TV show scenes with just a video clip or Instagram reel
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Film className="w-6 h-6 text-primary" />
              Upload Video
            </h2>
            <div className="space-y-4">
              <Button
                onClick={handleButtonClick}
                className="w-full h-32 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 bg-secondary/10 hover:bg-secondary/20"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                  <span className="text-xs text-muted-foreground">MP4, MP3 up to 5MB</span>
                </div>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/*,audio/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Link Section */}
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50 hover:border-primary/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-primary" />
              Instagram Reel
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Paste Instagram reel link here"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="pr-12"
                />
                <Button
                  onClick={handleLinkSubmit}
                  className="absolute right-1 top-1 h-8"
                  disabled={isProcessing}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            <p className="mt-2 text-muted-foreground">Processing your request...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {sceneDetails && (
          <div className="mt-8 bg-card rounded-xl p-6 shadow-lg border border-border/50 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-semibold mb-4">Scene Details</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Movie/Show</Label>
                <p className="text-lg font-medium">{sceneDetails.movie_or_show}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Season & Episode</Label>
                <p className="text-lg font-medium">{sceneDetails.season_and_episode}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Timestamp</Label>
                <p className="text-lg font-medium">{sceneDetails.timestamp}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Characters</Label>
                <p className="text-lg font-medium">{sceneDetails.characters}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Scene Context</Label>
                <p className="text-lg font-medium">{sceneDetails.scene_context}</p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              className="mt-6 w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Search
            </Button>
          </div>
        )}

        {/* Waitlist Section */}
        <div className="mt-12 bg-card rounded-xl p-6 shadow-lg border border-border/50">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Join the Waitlist
          </h2>
          <p className="text-muted-foreground mb-4">
            Be the first to know about new features and updates
          </p>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleWaitlistSubmit}
              disabled={isSubmitting || !isValidEmail(email)}
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Join"
              )}
            </Button>
          </div>
          {waitlistStatus.message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              waitlistStatus.type === "success"
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            }`}>
              {waitlistStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p>{waitlistStatus.message}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}