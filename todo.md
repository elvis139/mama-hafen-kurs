# Mama-Hafen TODO

## Kursbereich (Phase 2)
- [x] Datenbank-Schema: courseAccess-Tabelle hinzufügen (email, magicToken, tokenExpiresAt, grantedAt, isActive)
- [x] pnpm db:push ausführen
- [x] server/db.ts: Kurs-Zugangs-Hilfsfunktionen hinzufügen
- [x] server/routers.ts: course-Router mit requestAccess + verifyToken + getAccess
- [x] Workbook-PDF hochladen und URL speichern
- [x] client/src/pages/KursLogin.tsx: Magic-Link-Login-Seite bauen
- [x] client/src/pages/Kurs.tsx: Kursübersicht mit 11 Modulen bauen
- [x] client/src/App.tsx: /kurs und /kurs/login Routen hinzufügen
- [x] Home.tsx: Landingpage wiederherstellen (war durch Upgrade überschrieben)
- [x] Home.tsx: "Zum Kurs"-Button hinzufügen
- [x] Darleen-Foto hochladen und in Home.tsx ersetzen
- [x] Vitest-Tests für course-Router schreiben
- [x] Checkpoint speichern

## YouTube-Player Fixes
- [x] Vollbild-Modus aktivieren (allowfullscreen korrekt setzen)
- [x] YouTube-Controls ausblenden (controls=0 gesetzt)
- [x] Share-Button: nicht entfernbar (YouTube-Policy seit 2023 – modestbranding deprecated)

## Workbook & Video-Hosting
- [x] Workbook-Download reparieren (neue URL: Mama-Hafen-Workbook_3f11ba7d.pdf)
- [x] Video-Hosting: bunny.net Stream eingebunden (Library 655693)
- [x] BunnyPlayer-Komponente gebaut (iframe, kein Share-Button, Vollbild, adaptive Qualität)
- [x] Video-IDs direkt in modules-Array (bunnyId-Feld) – Modul 11 aktiv
- [x] Kurs.tsx: YouTube-Player durch BunnyPlayer ersetzt
- [x] Admin-Upload-Seite: nicht nötig – Video-IDs werden direkt in Kurs.tsx eingetragen

## Kursseite Layout-Fixes
- [x] Horizontales Scrollen beheben (overflow-x, box-sizing, kurs-page Klasse)
- [x] Header auf Kursseite responsiv verkleinern (clamp() für Schrift und Padding)

## PWA (Progressive Web App)
- [x] manifest.json erstellen (name, short_name, icons, theme_color, display: standalone)
- [x] PWA-Icons generieren (192x192 und 512x512 + apple-touch-icon 180x180)
- [x] index.html: manifest-Link, apple-touch-icon, theme-color Meta-Tags
- [x] Nav-Button-Fix: Zum-Kurs-Button auf Desktop sichtbar (Teal-Outline + Teal-Text)

## Fortschritts-Tracking
- [x] Fortschrittsbalken pro Modul in der Modulliste anzeigen
- [x] Video-Fortschritt: manuell per "Als gesehen markieren"-Button (bunny iframe API nicht verfügbar)
- [x] Fortschritt in localStorage speichern (pro E-Mail-Adresse)
- [x] Gesamtfortschritt: Fortschrittsbalken in Modulliste sichtbar

## Stripe-Kaufstrecke
- [x] Stripe-Feature aktivieren (webdev_add_feature)
- [x] Stripe-Secrets eintragen (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID)
- [x] Backend: POST /api/stripe/create-checkout (Express-Route)
- [x] Backend: /api/stripe/webhook Express-Route (raw body, Signatur-Prüfung)
- [x] Backend: Nach checkout.session.completed → courseAccess freischalten
- [x] Frontend: Kauf-Button auf Landingpage (Warteliste → Kaufen)
- [x] Frontend: /kauf/erfolg Bestätigungsseite
- [x] Frontend: /kauf/abbruch Abbruchseite
- [x] TypeScript prüfen (0 Fehler) und Checkpoint speichern

## Landingpage Conversion-Optimierung
- [x] Hero: "Auf die Warteliste"-Button → "Jetzt kaufen"-Button
- [x] Hero: Texte ohne Wartelisten-Bezug
- [x] CTA-Sektion: Warteliste-Formular → direktes Kauf-Formular (E-Mail + Kaufen)
- [x] Trust-Icons: Frühbucher/Warteliste-Badges entfernt, Conversion-Badges eingesetzt
- [x] Alle Bonusinhalte-Erwähnungen entfernt
- [x] FAQ: Wartelisten-Fragen entfernt, Kauf-relevante FAQs eingesetzt (Sofortzugang, Garantie)
- [x] Kurs-Sektion: Preisbox 97€ mit Kaufen-CTA eingebaut
- [x] Checkpoint speichern

## Stripe-Fix & Preis-Korrektur
- [x] Checkout-Fehler diagnostiziert und behoben (CUSTOM_STRIPE_* Variablen)
- [x] Preis auf Landingpage von 97€ auf 99€ korrigiert
- [x] Checkout-Flow getestet (Stripe-Session wird erfolgreich erstellt)

## End-to-End Test (Stripe)
- [ ] Stripe-Kaufstrecke im Browser mit Testkarte 4242 4242 4242 4242 testen
- [ ] Webhook checkout.session.completed verifizieren und courseAccess-Freischaltung bestätigen

## Danke-Seite Redesign
- [x] KaufErfolg.tsx visuell neu gestaltet (Karte, Check-Icon, Zugangs-Liste, Buttons, Einblend-Animation)

## Abbruch-Seite Redesign
- [x] KaufAbbruch.tsx visuell neu gestaltet (passend zur Erfolgsseite, klare Botschaft: nichts berechnet, erneut versuchen)

## Kurs-Zugangssicherung
- [x] Beta-Testzugang entfernen (kein offener Zugang mehr)
- [x] Nur Käufer mit isActive=true in course_access dürfen sich einloggen
- [x] Admin (elvis@darvismedia.de) bekommt immer Zugang, auch ohne Kauf-Eintrag

## Google Analytics / Tracking
- [x] Google Tag (G-CF7P1QL6EZ) in index.html einbauen
- [x] Conversion-Event (purchase) auf /kauf/erfolg feuern (Wert: 99 EUR)

## Admin-Dashboard & UTM-Tracking
- [x] Datenbankschema: UTM-Felder (utm_source, utm_medium, utm_campaign) in course_access
- [x] Datenbankschema: video_events-Tabelle (email, video_id, video_title, event_type, timestamp)
- [x] Server: UTM beim Checkout-Create speichern, beim Webhook in course_access schreiben
- [x] Server: Video-Event-Endpunkt (POST trpc course.trackVideoEvent)
- [x] Server: Admin-Daten-Endpunkt (Käuferliste + Video-Stats, nur für Admin)
- [x] Frontend: UTM-Parameter aus URL lesen, in sessionStorage speichern, beim Kauf mitschicken
- [x] Frontend: Video-Tracking im Kursbereich (Start/Replay-Events)
- [x] Admin-Seite /admin mit Käuferliste, Traffic-Quellen-Chart, Video-Stats (nur für Elvis)

## Manuelle Zugangsverwaltung (Admin)
- [x] Server-Endpunkt: einzelne E-Mail manuell anlegen (addSingleAccess)
- [x] Server-Endpunkt: CSV-Import mehrerer E-Mail-Adressen (addBulkAccess)
- [x] Server-Endpunkt: Zugang deaktivieren/reaktivieren (toggleAccess)
- [x] Admin-Dashboard: UI für Einzel-Anlage (Formular + Bestätigung)
- [x] Admin-Dashboard: UI für CSV-Upload (Datei hochladen + Vorschau + Bestätigung)
- [x] Admin-Dashboard: Deaktivieren/Reaktivieren-Button in Käuferliste

## Kursseite Kontakt
- [x] Kursseite: Kontakt-Link zu info@darvismedia.de hinzufügen

## Cookie-Banner (DSGVO)
- [x] CookieBanner-Komponente bauen (Akzeptieren / Ablehnen)
- [x] Meta Pixel erst nach Zustimmung laden
- [x] Google Analytics erst nach Zustimmung laden
- [x] Einwilligung in localStorage speichern

## Story-Sektion Landingpage
- [x] Emotionale Story-Sektion nach Hero einbauen (Leser abholen → Darlees Weg → Lösung)

## Automatischer Checkout-Monitor
- [x] /api/scheduled/checkout-monitor Route implementiert (sendet E-Mail bei Stripe-Fehler)
- [x] Stündlicher Cron-Job eingerichtet (alle 60 Minuten, Task-UID: dzMt2hM3ubRLPi2GKtTcq1)
