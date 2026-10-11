# Prüft, ob die Brevo-SMTP-Zugangsdaten stimmen – OHNE eine E-Mail zu verschicken.
# Aufruf im Terminal (im Projektordner):  python3 tools/test-brevo-smtp.py
# Login und SMTP key werden abgefragt; der Key wird beim Tippen nicht angezeigt und nirgends gespeichert.
import getpass, smtplib, ssl

HOST, PORT = "smtp-relay.brevo.com", 587
print("Brevo-SMTP-Test (es wird KEINE E-Mail verschickt)\n")
user = input("SMTP-Login (…@smtp-brevo.com): ").strip()
key = getpass.getpass("SMTP key (Eingabe unsichtbar): ").strip()

if "@smtp-brevo.com" not in user:
    print("⚠️  Der Login sieht ungewöhnlich aus – er endet normalerweise auf @smtp-brevo.com (nicht deine normale E-Mail-Adresse).")
if key.startswith("xkeysib-"):
    print("⚠️  Das ist ein API key (xkeysib-…). Für SMTP brauchst du den SMTP key (Reiter „SMTP“ in Brevo).")

try:
    with smtplib.SMTP(HOST, PORT, timeout=20) as s:
        s.ehlo(); s.starttls(context=ssl.create_default_context()); s.ehlo()
        s.login(user, key)
        print("\n✅ Anmeldung bei Brevo erfolgreich – Login und SMTP key stimmen.")
        print("   Dann liegt es vermutlich an der Absender-Adresse („Sender email“ in Supabase muss in Brevo bestätigt sein).")
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ Brevo lehnt die Anmeldung ab (Code {e.smtp_code}). Login oder SMTP key stimmen nicht.")
    print("   Tipp: in Brevo einen NEUEN SMTP key erzeugen und hier und in Supabase eintragen.")
except Exception as e:
    print(f"\n❌ Verbindung zu {HOST}:{PORT} fehlgeschlagen: {type(e).__name__}")
