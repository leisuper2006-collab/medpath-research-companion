# 公开发布前人工核对清单

## 内容核对

- [ ] 每个公开页面都声明医学AI输出仅用于教学与科研训练。
- [ ] 合成案例没有写成真实患者病例。
- [ ] 示例图没有写成真实研究结果。
- [ ] 公开来源线索没有替代正式引用。
- [ ] 开源工具 license 仍标注为待核对时，不得声称可直接商用或可复制代码。
- [ ] 文章流程没有生成虚假 p 值、均值、满意度或专家评分。

## 安全核对

- [ ] 仓库中没有 `.env`。
- [ ] 没有 API Key、token、私钥、HPC 密码。
- [ ] 没有身份证号、手机号、邮箱等不必要个人敏感信息。
- [ ] 没有真实患者数据和可识别病理图片。
- [ ] 没有未授权课程材料。

## 技术核对

- [ ] `pytest apps\api\tests -q` 通过。
- [ ] `python scripts\round13_content_uniqueness_audit.py` 通过。
- [ ] `python scripts\build_static_release.py` 通过。
- [ ] `python scripts\round12_release_readiness_check.py` 通过。
- [ ] 静态包 `dist/github-pages-demo` 存在。
- [ ] GitHub Actions workflow 未读取真实密钥。

## 人工责任

公开演示站只证明本地原型可运行，不证明真实平台上线、真实课程试点、真实教学效果提升或临床可用性。正式对外宣传前，应由负责人确认公开范围、知识产权状态、课程授权状态和伦理边界。
