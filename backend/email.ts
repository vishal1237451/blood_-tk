export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;

  // Fallback to simulated console log if key is not configured
  if (!apiKey) {
    console.log(`\n--- [EMAIL SIMULATOR (Missing Resend API Key)] ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (HTML):\n${html}`);
    console.log(`--------------------------------------------------\n`);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BloodBank <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", data);
      return { success: false, error: data.message || "Failed to send email via Resend." };
    }

    console.log(`Email successfully sent to ${to} via Resend. ID: ${data.id}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Exception sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
