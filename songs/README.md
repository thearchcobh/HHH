# Pocket songbook preview

Open `/songs/` on any static host, or run `python3 -m http.server 8000` in the repository root and visit `http://localhost:8000/songs/`.

No build step, external fonts, CDN calls, accounts, or backend. The QR generator is vendored qrcode-generator 2.0.4 by Kazuhiko Arase (MIT; notice retained in the file). The QR encodes the current page URL, without query parameters or a fragment; a localhost QR is explicitly labelled as a local preview. Deploy before sharing with other phones.

## Included

- 22 existing Madrid HHH titles, alphabetically sorted, without numbers.
- Search across titles, opening lines and lyrics; case/accent/punctuation tolerant.
- One expanded song at a time; optional larger lyric type.
- Device-local sung checkboxes, Remaining/Sung/All filters, Undo, and New circle.
- QR share dialog and copy link.
- Keyboard controls, native modal focus handling, labelled checkboxes and status messages.

## Content status

This is an interaction example, not a finished transcription. Swing Low uses a traditional public-domain version (not the club adaptation). Down-Down Song contains a short excerpt. The other 20 entries explicitly link to the source hymnals rather than inventing lyrics. Supply the club's lyric text to populate each `firstLine` and `lyrics` field in `songs.js`; preserve the stable `id` values so saved selections remain valid. Source: https://madridhhh.com/hash-hymnals/ .

All data loads up front; opening and searching songs requires no further network calls after initial loading. Offline reopening is not implemented. Storage failures are tolerated, but selections then last only for the current page session. No shared circle state or microphone features.

The wine-run home page is unchanged. This preview is intended for review on its feature branch before merging or enabling hosting.
