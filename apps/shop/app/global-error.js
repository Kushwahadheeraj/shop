"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ padding: "80px", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>{error?.message || "An unexpected error occurred."}</p>
          {reset && (
            <button onClick={() => reset()}>
              Try again
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
