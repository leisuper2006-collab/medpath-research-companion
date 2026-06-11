from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = ROOT / "data"
OUTPUT_DIR = ROOT / "outputs"


@lru_cache(maxsize=32)
def load_json(name: str) -> Any:
    path = DATA_DIR / name
    return json.loads(path.read_text(encoding="utf-8-sig"))


def save_output(relative_path: str, content: str) -> str:
    path = OUTPUT_DIR / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")
    return str(path.relative_to(ROOT))


def clear_cache() -> None:
    load_json.cache_clear()
