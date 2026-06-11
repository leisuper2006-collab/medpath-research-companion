# Round 11 GitHub 发布准备计划

## 当前状态

- 当前目录不是 Git 仓库，未发现 `.git`。
- 当前目录未绑定 GitHub 远程地址。
- 本轮没有声称已经发布到 GitHub，也没有声称已经部署到公网。
- 已新增 `.gitignore`，用于避免 `.env`、密钥、SSH 私钥、患者数据、真实课程记录等敏感内容误提交。

## 发布前必须完成的人工检查

1. 确认仓库名称和归属账号。
2. 确认哪些目录可以公开，哪些目录必须保持本地或私有。
3. 检查是否存在真实患者隐私、课程未授权材料、教师评分、学生问卷或平台账号信息。
4. 检查是否存在 API Key、SSH 密码、token、cookie、私钥。
5. 确认 README 中的边界声明与学校/课题组要求一致。

## 推荐公开目录

可公开或可作为开源样例的内容：

- `apps/`
- `data/` 中的合成数据、方法卡、公开工具清单和示例规则；
- `docs/` 中的公开说明、审计报告、部署说明；
- `outputs/round11_plots/` 中的合成数据 SVG 示例图；
- `scripts/` 中不含密钥、不含真实患者数据的检查脚本；
- `tests/`
- `.env.example`
- `.gitignore`
- `README.md`

需谨慎或不公开的内容：

- 真实患者数据；
- 未授权课程材料；
- 真实教师评分、学生问卷、课程试点记录；
- API Key、SSH 账号密码、HPC 作业凭证；
- 含有个人隐私或敏感机构信息的附件。

## 本地发布命令

在用户确认仓库名称后执行：

```powershell
cd "C:\Users\HONOR\Desktop\AI skill\medpath-research-education-skills-studio-real"
git init
git add .
git commit -m "feat: build MedPath research education skills studio"
git branch -M main
git remote add origin https://github.com/<your-name>/<repo-name>.git
git push -u origin main
```

如果用户已经创建 GitHub 空仓库，只需要替换 `<your-name>/<repo-name>`。

## 部署路线

### 路线 A：私有/校内服务器

适合课程组试用和课题申报答辩。运行 FastAPI 服务，不公开真实数据。

```powershell
cd apps/api
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 路线 B：Docker 部署

适合服务器上快速复现。

```powershell
docker compose up
```

### 路线 C：公网演示

可部署到支持 Python Web 服务的平台。需要注意：

- 只能使用合成数据和公开样例；
- `.env` 必须由平台环境变量配置；
- 不上传真实患者数据；
- 模型 API 默认可先用 mock 模式；
- 若接入真实模型 API，需要记录调用边界和费用控制。

### 路线 D：D03/D10 迁移

本地平台可作为迁移前试验台。当前只准备字段、页面和接口原型，不声称已在 D03/D10 上线。

## 发布前回归命令

```powershell
pytest apps\api\tests -q
python scripts\round11_run_checks.py
```

当前状态：

- `pytest apps\api\tests -q`：15 passed。
- `python scripts\round11_run_checks.py`：PASS。

## 必须保留的声明

医学 AI 输出仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。所有输出须经教师、导师或专家复核。本仓库不得包含真实患者隐私、未授权课程材料、API Key、SSH 密码或其他敏感凭证。
