# Madrid HHH pocket songbook

Open `/songbook/` on any static host, or run `python3 -m http.server 8000` in the repository root and visit `http://localhost:8000/songbook/`.

No build step, external fonts, CDN calls, accounts, or backend. The QR generator is vendored qrcode-generator 2.0.4 by Kazuhiko Arase (MIT; notice retained in the file). The QR encodes the current page URL, without query parameters or a fragment; a localhost QR is explicitly labelled as a local preview. Deploy before sharing with other phones.

## Included

- 22 existing Madrid HHH titles, alphabetically sorted, without numbers.
- Search across titles, opening lines and lyrics; case/accent/punctuation tolerant.
- One expanded song at a time; optional larger lyric type.
- Device-local sung checkboxes, Remaining/Sung/All filters, Undo, and New circle.
- QR share dialog and copy link.
- Keyboard controls, native modal focus handling, labelled checkboxes and status messages.

## Content status

All 22 songs contain the club lyrics supplied by the user on 4 October 2026, with opening lines and tune/performance notes. Wording is preserved; joined lines and verse spacing are cleaned up. Edit `songs.js` to maintain lyrics, retaining stable IDs. Source: https://madridhhh.com/hash-hymnals/ .

All data loads up front; opening and searching songs requires no further network calls after initial loading. Offline reopening is not implemented. Storage failures are tolerated, but selections then last only for the current page session. No shared circle state or microphone features.

Published at https://thearchcobh.github.io/HHH/songbook/ . The wine-run home page is unchanged.
