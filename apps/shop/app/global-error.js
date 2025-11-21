"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: "80px", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>{error?.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              background: "#111827",
              color: "#fff",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
