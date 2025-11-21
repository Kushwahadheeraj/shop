"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ padding: "40px", textAlign: "center" }}>
        <h1>Something went wrong</h1>
        <p>{error?.message}</p>

        <button
          onClick={() => reset()}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: "black",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
