"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div style={{ padding: "80px", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ marginBottom: "1rem", color: "#666" }}>
            {error?.message || "An unexpected error occurred."}
          </p>
          {reset && typeof reset === 'function' && (
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
                fontSize: "1rem",
              }}
            >
              Try again
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
