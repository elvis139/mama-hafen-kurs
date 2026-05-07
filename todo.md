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
