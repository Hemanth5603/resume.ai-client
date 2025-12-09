import { NextRequest, NextResponse } from "next/server";

// Proxying to backend to avoid CORS issues
// Render.com: No strict timeout limits (suitable for long-running requests)

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_RESUME_API_HOST || "https://www.nexuretech.in";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header if present
    const authHeader = request.headers.get("authorization");

    // Get the FormData from the request
    const formData = await request.formData();

    // Prepare headers for the backend request
    const headers: HeadersInit = {};

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Note: Don't set Content-Type for FormData - browser will set it with boundary

    // Make the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/api/v1/generate_resume`, {
      method: "POST",
      headers,
      body: formData,
      // No timeout on the fetch itself - let Vercel's maxDuration handle it
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Backend API error",
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    // Get the response data
    const data = await response.json();

    // Return the data
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error in generate_resume proxy:", error);

    return NextResponse.json(
      {
        error: "Failed to generate resume",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
