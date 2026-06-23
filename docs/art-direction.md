# 美术风格定稿 V1

## 核心方向

项目正式美术采用“暗黑童话纸牌剧场”风格。

关键词：

- 暗黑童话
- 纸牌剧场
- 梦境法庭
- 赌场仪式
- 镜面、档案、审判、王冠
- 低饱和暗色
- 金色线条点缀
- 半写实手绘厚涂
- 轮廓清晰
- 小尺寸可读

一句话描述：

```txt
一个低饱和暗黑童话纸牌剧场，角色与怪物像梦境法庭中的纸牌人偶、赌场职员和审判者，画面使用半写实厚涂插画，暗色背景配金色线条，轮廓清晰，适合网页肉鸽游戏 UI 中小尺寸展示。
```

## 视觉目标

正式资源优先服务三个目标：

1. 统一：所有角色、怪物、Boss、藏品、背景应像来自同一个世界。
2. 可读：战斗中小头像、图标、节点图形在缩小时仍能识别轮廓和阵营。
3. 可替换：所有正式图都按固定路径接入，后续可以直接替换当前 SVG 占位图。

不追求超高写实、复杂服饰细节或大面积特效。第一版重点是让面试官一眼看出项目完整度和 AIGC 美术管线能力。

## 色彩规范

基础色：

```txt
背景黑：#101015 / #15151c
面板灰紫：#24232c / #2c2a35
纸张暖白：#efe4d5
暗红：#9b3648 / #b9414b
暗金：#d9a746 / #f1d17a
暗蓝：#334a70 / #67a6d9
暗绿：#496f4b / #7fbc77
暗紫：#65427d / #9a78d3
```

使用规则：

- 背景以暗色为主，避免纯黑。
- 金色用于边框、节点、高价值信息和仪式感装饰。
- 红色用于威胁、生命、攻击和红桃/方片相关视觉。
- 蓝色用于防御、制牌、档案、护盾和黑桃/方片的冷感。
- 绿色用于商店、恢复、交换和资源。
- 紫色用于诅咒、梦境、事件和 Boss 异常感。

## 构图规范

角色与怪物头像：

- 正方形画布。
- 主体占画面 70%-85%。
- 背景简洁，允许有暗色纹理、纸牌边框、金线或舞台光。
- 轮廓优先，细节其次。
- 不要裁掉头部、武器核心部位或标志性特征。

Boss 头像：

- 正方形画布。
- 主体占画面 75%-90%。
- 比普通怪更强的轮廓、更明显的冠冕/审判/赌局符号。
- 可以加入背光、王冠、牌桌、法庭柱、镜面裂纹等强化压迫感。

场景背景：

- 横向宽图。
- 中央或右侧留出视觉焦点，左侧保留 UI 文本可读空间。
- 不要使用大面积高亮、复杂文字或过强对比。
- 必须能在裁切后仍保留主题信息。

藏品图标：

- 正方形画布。
- 单一主体物件，周围可有少量金线或光晕。
- 禁止复杂背景。
- 缩到 40px 时仍能看出是什么。

## 资产优先级

第一批正式资源只做“风格验证包”，不直接全量生成。

优先级：

1. 主角半身像 1 张。
2. Boss 头像 1 张。
3. 普通怪头像 2 张。
4. 精英怪头像 1 张。
5. 事件背景 1 张。
6. 藏品图标 4 张。

通过这批确认风格后，再扩展到全量资源。

第二批正式资源：

1. 6 个 Boss 头像。
2. 全部普通怪、精英怪、召唤物头像。
3. 5 层地图背景。
4. 战斗普通背景和 Boss 背景。
5. 商店、制牌室、事件场景背景。
6. 重要核心藏品图标。

第三批正式资源：

1. 全量藏品图标。
2. 卡包图标。
3. 扑克牌装饰框。
4. 状态图标和意图图标精修。
5. 开始页封面。

## 统一提示词模板

### 主角

```txt
dark fairytale playing-card theater, a young card rogue protagonist, half body portrait, dream court atmosphere, elegant but practical outfit inspired by poker cards, low saturation dark colors, subtle gold line accents, painterly semi-realistic illustration, clear silhouette, readable at small game UI size, soft stage lighting, no text, no logo
```

### 普通怪

```txt
dark fairytale playing-card theater, [monster concept], small enemy portrait for a roguelike card game, dream court and casino atmosphere, low saturation dark colors, subtle gold line accents, painterly semi-realistic illustration, clear silhouette, readable at small UI size, simple dark background, no text, no logo
```

### 精英怪

```txt
dark fairytale playing-card theater, elite enemy portrait, [monster concept], more imposing than common enemies, dream court and casino atmosphere, low saturation dark colors, gold line accents, painterly semi-realistic illustration, clear silhouette, readable at small UI size, no text, no logo
```

### Boss

```txt
dark fairytale playing-card theater, boss portrait, [boss concept], oppressive dream court atmosphere, poker and judgment motifs, crown or casino symbolism, low saturation dark colors, dramatic but readable lighting, gold line accents, painterly semi-realistic illustration, strong silhouette, no text, no logo
```

### 场景

```txt
dark fairytale playing-card theater environment, [scene concept], dream court and casino atmosphere, low saturation dark colors, gold line accents, painterly background, wide horizontal composition, UI-friendly empty space, readable shapes, no text, no logo
```

### 藏品

```txt
dark fairytale playing-card theater relic icon, [relic concept], single object centered, low saturation dark background, gold line accents, painterly semi-realistic icon, clear silhouette, readable at 40px, no text, no logo
```

## 负面约束

生成时尽量避免：

```txt
text, logo, watermark, blurry, over-detailed background, modern sci-fi, cute chibi, anime school uniform, photorealistic human, 3d render, neon cyberpunk, high saturation, excessive particles, unreadable silhouette, cropped head, extra limbs, malformed hands
```

## 文件命名规范

所有正式资源使用英文小写短横线命名。

示例：

```txt
public/assets/characters/holder-hero.png
public/assets/enemies/fast-dealer.png
public/assets/bosses/final-dealer.png
public/assets/scenes/event-table.png
public/assets/relics/gold-gourd.png
```

当前 SVG 占位文件可以继续保留。正式图落地时优先采用同名 PNG 或 WebP，并由代码资源解析函数优先读取正式图。

## 技术落地规则

- GitHub Pages 可以直接部署图片资源。
- 正式图不需要 base64 编码进代码。
- 推荐格式：PNG 或 WebP。
- 头像建议尺寸：512x512。
- 藏品/状态/意图图标建议尺寸：256x256。
- 场景背景建议尺寸：1536x512 或 1920x640。
- 单张图片优先控制在 500KB 以下。
- 全量首版资源建议控制在 30MB 以内。

## 第一批验证清单

生成前先确认以下 10 个资源：

```txt
characters/holder-hero
bosses/final-dealer
enemies/fast-dealer
enemies/echo-iron-chest
enemies/two-faced-auditor
scenes/event-table
relics/gold-gourd
relics/echo-shield
relics/club-crown
relics/cursed-contract
```

确认标准：

- 放进当前 UI 后不突兀。
- 缩小后仍能识别主体。
- 色调不会压过文字。
- 怪物与 Boss 有明显强弱差异。
- 藏品图标不会互相混淆。

