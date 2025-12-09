import { NextRequest, NextResponse } from "next/server";

// Proxying to backend to avoid CORS issues
// Render.com: No strict timeout limits (suitable for long-running requests)

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_RESUME_API_HOST || "https://www.nexuretech.in";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header if present
    const authHeader = request.headers.get("authorization");

    // Prepare headers for the backend request
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Make the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/api/v1/get_job_roles`, {
      method: "GET",
      headers,
      // No timeout on the fetch itself - let platform handle it
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

    // Return the data with appropriate headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in get_job_roles proxy:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch job roles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
