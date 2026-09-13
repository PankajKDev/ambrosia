import { render } from "@react-email/render";

function EmailVerificationTemplate({
  firstName,
  verificationLink,
}: {
  firstName: string;
  verificationLink: string;
}) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#1a1a1a", lineHeight: 1.6, maxWidth: 520, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        Welcome to Ambrosia, {firstName}!
      </h1>

      <p style={{ fontSize: 15, color: "#444", marginTop: 0 }}>
        Thanks for signing up — we&apos;re glad you&apos;re here. Please confirm
        your email address to activate your account.
      </p>

      <a
        href={verificationLink}
        style={{
          display: "inline-block",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: 15,
          padding: "12px 28px",
          borderRadius: 12,
          textDecoration: "none",
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        Verify email
      </a>

      <p style={{ fontSize: 14, color: "#666", marginTop: 24, marginBottom: 4 }}>
        This link expires in 1 hour. If you didn&apos;t create an account on
        Ambrosia, you can safely ignore this email.
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "28px 0" }} />

      <p style={{ fontSize: 13, color: "#999", marginTop: 0 }}>
        Sent with care from the Ambrosia team
      </p>
    </div>
  );
}

export default EmailVerificationTemplate;

export async function renderEmailVerificationTemplate(args: {
  firstName: string;
  verificationLink: string;
}) {
  return render(<EmailVerificationTemplate {...args} />);
}