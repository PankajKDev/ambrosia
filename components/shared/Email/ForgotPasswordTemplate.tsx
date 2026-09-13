import { render } from "@react-email/render";

function ForgotPasswordTemplate({
  firstName,
  resetLink,
}: {
  firstName: string;
  resetLink: string;
}) {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        color: "#1a1a1a",
        lineHeight: 1.6,
        maxWidth: 520,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        Hi {firstName},
      </h1>

      <p style={{ fontSize: 15, color: "#444", marginTop: 0 }}>
        We received a request to reset the password for your Ambrosia account.
      </p>

      <a
        href={resetLink}
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
        Reset password
      </a>

      <p
        style={{ fontSize: 14, color: "#666", marginTop: 24, marginBottom: 4 }}
      >
        This link expires in 1 hour. If you didn&apos;t request this, you can
        safely ignore this email — your account remains unchanged.
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #eee",
          margin: "28px 0",
        }}
      />

      <p style={{ fontSize: 13, color: "#999", marginTop: 0 }}>
        Sent with care from the Ambrosia team
      </p>
    </div>
  );
}

export default ForgotPasswordTemplate;

export async function renderForgotPasswordTemplate(args: {
  firstName: string;
  resetLink: string;
}) {
  return render(<ForgotPasswordTemplate {...args} />);
}
