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
