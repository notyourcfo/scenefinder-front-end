export async function POST(req) {
  try {
    const { reelUrl } = await req.json()
    if (!reelUrl) {
      return new Response(JSON.stringify({ error: "Missing reelUrl" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const response = await fetch("https://scenefinder-apify-919056896443.us-central1.run.app/api/process-reel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reelUrl }),
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return new Response(JSON.stringify({ error: "Failed to process reel", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}