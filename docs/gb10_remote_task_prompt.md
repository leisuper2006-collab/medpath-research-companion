# GB10 远程执行提示词

请在 GB10 开发服务器中执行以下任务，不要保存任何密钥或真实患者数据：

1. 拉取或复制 `medpath-research-education-skills-studio-real` 项目。
2. 安装 Python 依赖：`pip install -r apps/api/requirements.txt`。
3. 启动后端：`cd apps/api && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`。
4. 启动前端：`cd apps/api && python -m uvicorn app.main:app --host 0.0.0.0 --port 3000`。
5. 运行 `pytest apps/api/tests` 和 `python scripts/run_all_checks.py`。
6. 如 Node/Playwright 可用，运行 `apps/web/tests/e2e/navigation.spec.ts`。

注意：GB10 是开发服务器，不是产品正式服务器；不得在项目文档中写成正式部署地址。

