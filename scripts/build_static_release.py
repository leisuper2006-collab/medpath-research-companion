from __future__ import annotations

import json
import re
import shutil
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist" / "github-pages-demo"
WEB = ROOT / "apps" / "web"
DATA = ROOT / "data"
OUTPUTS = ROOT / "outputs"

DATA_FILES = [
    "plugins.json",
    "skills.json",
    "synthetic_cases.json",
    "comparison_demos.json",
    "providers.json",
    "public_example_sources.json",
    "public_source_visual_examples.json",
    "model_gateway_templates.json",
    "method_cards.json",
    "open_source_catalog.json",
    "method_learning_guides.json",
    "method_universe.json",
    "gene_perturbation_methods.json",
    "article_skill_workflows.json",
    "plot_gallery_taxonomy.json",
    "data_audit_rules.json",
    "research_island_buildings.json",
    "pet_dialogues.json",
]


def copy_tree(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    copy_tree(WEB / "static", DIST / "static")
    copy_tree(OUTPUTS, DIST / "outputs")
    (DIST / "static-data").mkdir()

    for name in DATA_FILES:
        src = DATA / name
        if not src.exists():
            raise FileNotFoundError(src)
        shutil.copy2(src, DIST / "static-data" / name)

    index = (WEB / "index.html").read_text(encoding="utf-8")
    index = re.sub(r'href="/static/styles\.css(\?[^"]*)?"', r'href="static/styles.css\1"', index)
    index = re.sub(r'href="/static/round73\.css(\?[^"]*)?"', r'href="static/round73.css\1"', index)
    index = index.replace('href="/manifest.webmanifest"', 'href="manifest.webmanifest"')
    icon_svg = (WEB / "static" / "icons" / "medpath-icon.svg").read_text(encoding="utf-8")
    icon_data_url = "data:image/svg+xml," + quote(icon_svg)
    index = index.replace('href="/static/icons/medpath-icon.svg"', f'href="{icon_data_url}"')
    index = re.sub(r'src="/static/app\.js(\?[^"]*)?"', r'src="static/app.js\1"', index)
    index = re.sub(r'src="/static/round73\.js(\?[^"]*)?"', r'src="static/round73.js\1"', index)
    config = """
    <script>
      window.MEDPATH_STATIC_MODE = true;
      window.MEDPATH_API_BASE = ".";
      window.MEDPATH_STATIC_DATA_BASE = "static-data";
    </script>
"""
    index = re.sub(
        r'(\s*<script src="static/app\.js(?:\?[^"]*)?"></script>)',
        lambda match: f"{config}{match.group(1)}",
        index,
        count=1,
    )
    (DIST / "index.html").write_text(index, encoding="utf-8")
    (DIST / "404.html").write_text(index, encoding="utf-8")
    shutil.copy2(WEB / "manifest.webmanifest", DIST / "manifest.webmanifest")
    shutil.copy2(WEB / "sw.js", DIST / "sw.js")

    readme = """# MedPath Research Companion 静态发布包

该目录可作为 GitHub Pages / Vercel 静态演示包使用。它不连接真实模型 API，不读取 API Key，不处理真实患者数据。

## 本地预览

```powershell
cd dist/github-pages-demo
python -m http.server 4173
```

访问：http://127.0.0.1:4173/

## 边界

- 静态发布版使用本地 JSON 和 mock 交互。
- 不代表真实 D03/D10 上线。
- 不代表真实课程试点。
- 示例图为合成教学演示或教学改绘，不代表真实研究结果。
- 医学 AI 输出仅用于教学与科研训练，不替代临床诊断。
"""
    (DIST / "README.md").write_text(readme, encoding="utf-8")

    manifest = {
        "name": "MedPath Research Companion static demo",
        "mode": "static-demo",
        "data_files": DATA_FILES,
        "outputs_copied": True,
        "safety": "医学 AI 输出仅用于教学与科研训练，不替代临床诊断。",
    }
    (DIST / "release-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Static release built: {DIST}")


if __name__ == "__main__":
    main()
