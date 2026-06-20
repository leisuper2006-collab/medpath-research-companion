# MedPath Research Companion 静态发布包

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
