from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = [
    r"sk-[A-Za-z0-9]{20,}",
    r"AIza[0-9A-Za-z\-_]{20,}",
    r"xox[baprs]-[0-9A-Za-z-]{20,}",
    r"-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----",
]

found = []
for path in ROOT.rglob("*"):
    if path.is_file() and path.suffix.lower() in {".py", ".js", ".ts", ".html", ".md", ".json", ".yaml", ".yml", ".txt", ".example"}:
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pattern in PATTERNS:
            if re.search(pattern, text):
                found.append(str(path.relative_to(ROOT)))

if found:
    print("secret-like patterns found:", found)
    raise SystemExit(1)
print("no secret-like patterns found")

