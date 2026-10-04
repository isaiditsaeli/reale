export default function AuthErrorPage() {
  return (
    <main className="auth-error-page">
      <section className="auth-error-card">
        <p className="auth-error-label">
          REALE
        </p>

        <h1>
          You're not part
          <br />
          of Reale yet.
        </h1>

        <p className="auth-error-description">
          This Discord account hasn't been
          added to the Reale family.
        </p>

        <a
          href="/"
          className="auth-error-button"
        >
          Return Home
        </a>
      </section>
    </main>
  );
}