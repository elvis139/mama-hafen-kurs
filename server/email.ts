import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Sendet eine Willkommens-E-Mail nach dem Kauf des Mama-Hafen-Kurses.
 */
export async function sendWelcomeEmail(to: string, courseUrl: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Willkommen im Mama-Hafen!</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:#2a7c6f;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:28px;">⚓</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#ffffff;font-weight:700;letter-spacing:-0.5px;">
                Mama-Hafen
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:0.08em;text-transform:uppercase;">
                Gelassen durch die Autonomiephase
              </p>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;">

              <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:#1a2e2a;line-height:1.3;">
                🎉 Du hast es geschafft!<br/>
                <span style="color:#2a7c6f;">Willkommen an Bord.</span>
              </h2>

              <p style="margin:0 0 20px;font-size:16px;color:#4a5568;line-height:1.7;">
                Ich freue mich riesig, dass du dir diesen Schritt gegönnt hast – für dich und für eure Familie. 
                Der Mama-Hafen-Kurs ist jetzt für dich freigeschaltet und wartet auf dich.
              </p>

              <!-- QUOTE BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#f0f9f7;border-left:4px solid #2a7c6f;border-radius:0 8px 8px 0;padding:18px 20px;">
                    <p style="margin:0;font-size:15px;color:#2a7c6f;font-style:italic;line-height:1.6;">
                      „Du bist der sichere Hafen, von dem aus dein Kind die Welt erkundet."
                    </p>
                    <p style="margin:8px 0 0;font-size:13px;color:#718096;font-weight:600;">— John Bowlby</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:16px;color:#4a5568;line-height:1.7;">
                In den nächsten <strong style="color:#1a2e2a;">11 Video-Lektionen</strong> lernst du:
              </p>

              <!-- FEATURE LIST -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;font-size:16px;">🧠</td>
                        <td style="font-size:15px;color:#4a5568;line-height:1.6;padding-left:8px;">
                          <strong style="color:#1a2e2a;">Warum dein Kind so reagiert</strong> – und dass es kein Trotz ist
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;font-size:16px;">🌊</td>
                        <td style="font-size:15px;color:#4a5568;line-height:1.6;padding-left:8px;">
                          <strong style="color:#1a2e2a;">Erste Hilfe bei Wutanfällen</strong> – auch in der Öffentlichkeit
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;font-size:16px;">💛</td>
                        <td style="font-size:15px;color:#4a5568;line-height:1.6;padding-left:8px;">
                          <strong style="color:#1a2e2a;">Grenzen setzen mit Liebe</strong> – ohne Machtkämpfe
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;font-size:16px;">⚓</td>
                        <td style="font-size:15px;color:#4a5568;line-height:1.6;padding-left:8px;">
                          <strong style="color:#1a2e2a;">Wieder Ruhe im Familienalltag</strong> – und mehr Leichtigkeit für dich
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;font-size:16px;color:#4a5568;line-height:1.7;">
                Gönn dir heute Abend die erste Lektion – du wirst überrascht sein, wie viel sich allein durch das 
                <em>Verstehen</em> verändert. 🌿
              </p>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td align="center">
                    <a href="${courseUrl}"
                       style="display:inline-block;background:#e07a5f;color:#ffffff;font-size:17px;font-weight:700;
                              text-decoration:none;padding:16px 40px;border-radius:50px;
                              letter-spacing:0.02em;box-shadow:0 4px 16px rgba(224,122,95,0.35);">
                      🎬 Jetzt Kurs starten →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#a0aec0;text-align:center;line-height:1.6;">
                Du hast dauerhaften Zugang – auch für dein zweites Kind.<br/>
                Bei Fragen erreichst du uns jederzeit unter 
                <a href="mailto:info@darvismedia.de" style="color:#2a7c6f;text-decoration:none;">info@darvismedia.de</a>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#2a7c6f;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
                Mama-Hafen · Ein Kurs von Mamaleen<br/>
                <a href="https://mamahafen.manus.space" style="color:rgba(255,255,255,0.9);text-decoration:none;">
                  mamahafen.manus.space
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Mamaleen – Mama-Hafen" <${process.env.GMAIL_USER}>`,
    to,
    subject: "🎉 Willkommen im Mama-Hafen! Dein Kurs wartet auf dich.",
    html,
    text: `Willkommen im Mama-Hafen!\n\nDein Kurs ist jetzt freigeschaltet. Starte hier: ${courseUrl}\n\nBei Fragen: info@darvismedia.de`,
  });
}
