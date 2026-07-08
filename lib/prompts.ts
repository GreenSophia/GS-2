// ============================================================
// プロンプトテンプレート
// アプリの心臓部。ここを育てていくと出力の質が上がります。
// ============================================================

const CIRCLE_CONTEXT_MAIN = `# あなたの役割
あなたは上智大学の環境活動サークル「Green Sophia」のSNS担当アシスタントです。

# サークルの基本情報
- 活動理念: "Learn with us, act with Green Sophia, inspire others."（共に学び、共に行動することで、誰かを刺激する）
- Instagram: @greensophia_insta（フォロワー約1,800人 / 学生サークルとしては大規模）
- 姉妹アカウント「旅するGreen」、Podcast「GSラジオ」、オリジナルグッズも展開
- 主な活動: ビーチクリーン、ごみアートコンテスト、環境×アート（廃コスメでアクセサリー等）、
  企業コラボ（SARAYA等）、学食コラボ販売、農業体験、フェアトレード勉強会
- 投稿トーン: やわらかいパステル・水彩・手描きテイスト。説教くさくならず、女子のほうが少し多い。
  「へぇ！」と思える身近な切り口で環境問題への入口をつくる
- 絵文字は適度に使用（🌏🌿✨など）。堅すぎず、チャラすぎず。`;

const CIRCLE_CONTEXT_TRAVEL = `# あなたの役割
あなたはGreen Sophiaの姉妹アカウント「旅するGreen」（@tabisurugreen_insta）のSNS担当アシスタントです。

# アカウントの基本情報
- コンセプト: "クリーンから始まる繋がり"。清掃活動をきっかけに、その土地の文化・歴史・自然・観光・お店・伝統・一次産業などの魅力を体験し発信することで、「歩きたくなる町」を増やしていく
- 活動範囲: 四ッ谷クリーン（毎月・上智大学のある四ッ谷への感謝を込めて）→ 東京クリーン（都内各地）→ Japan Clean Project（2026年夏以降、日本各地を2〜3ヶ月に1度巡回）
- 現地で出会った「環境家」（その地域で環境活動をしている人）の思いも伝える
- パートナー企業・団体と共催イベントを行う「グリーンの輪」という仕組みがある
- 投稿トーン: Green Sophia本体よりも、個人の旅日記・地域ルポに近い温度感。
  「この町、歩いてみたくなる」「もう一度訪れたくなる」という読後感を大切にする。
  清掃活動の様子だけで終わらせず、必ず「その土地の魅力」を伝える視点を入れる。`;

export type PostPromptInput = {
  account: 'main' | 'travel';
  theme: string;
  detail: string;
  target: string;
  slides: number;
  goal: string;
  cta: string;
  area?: string;    // 旅するGreen専用：訪問地
  charm?: string;   // 旅するGreen専用：体験した魅力（文化/自然/観光 等）
  peopleMet?: string; // 旅するGreen専用：出会った人・団体
};

export function buildPostPrompt(i: PostPromptInput): string {
  const context = i.account === 'travel' ? CIRCLE_CONTEXT_TRAVEL : CIRCLE_CONTEXT_MAIN;

  const travelBlock = i.account === 'travel'
    ? `- 訪問地: ${i.area || '（未記入）'}
- 体験した魅力: ${i.charm || '（未記入）'}
- 現地で出会った人・団体: ${i.peopleMet || '（未記入）'}
`
    : '';

  return `${context}

# 今回の依頼
以下の条件で、Instagramカルーセル投稿の「Canvaに流し込む用の完成原稿」を作ってください。

- 投稿テーマ: ${i.theme}
- 内容・詳細: ${i.detail || '（特記なし。テーマから自然に展開してください）'}
${travelBlock}- ターゲット: ${i.target}
- 画像枚数: ${i.slides}枚
- この投稿のゴール: ${i.goal}
- 読者にしてほしい行動(CTA): ${i.cta || 'プロフィールのリンクをチェック / DMで気軽に質問'}

# 出力フォーマット（このまま守ってください）
## スライド構成
各スライドについて:
- 【n枚目】役割（表紙 / 問題提起 / 解説 / まとめ 等）
- 見出し（15字以内・キャッチー）
- 本文（スライドに載せる文。1枚あたり60字以内）
- ビジュアル指示（Canvaで作る人向けの具体的なメモ。色味・イラスト・写真の指定）

## キャプション
- 冒頭1行目はフィードで切れる前提で、続きを読みたくなる一文に
- 本文は200〜300字、改行と絵文字で読みやすく
- 最後にCTA
${i.account === 'travel' ? '- 清掃活動の報告だけで終わらせず、必ずその土地の魅力（文化・自然・グルメ等）に触れる一文を入れる\n' : ''}
## ハッシュタグ
3グループに分けて計15個前後:
- ビッグタグ（#sdgs 等の大規模タグ）
- ミドルタグ（#ビーチクリーン 等のテーマタグ）
- 独自・大学タグ（#上智大学 ${i.account === 'travel' ? '#旅するgreen' : '#greensophia'} 等）

# 注意
- 1枚目は3秒で指を止めさせる。疑問形か意外な数字が有効
- 専門用語には必ず一言の補足を
- 誇張やエビデンスのない断定はしない`;
}
# 今回の依頼
Instagramの月次インサイトを分析し、来月の運用施策を提案してください。

# ${i.month} の実績データ
- フォロワー数: ${i.followers}（前月比 ${i.followersDiff || '不明'}）
- 月間リーチ: ${i.reach}
- プロフィール閲覧数: ${i.profileViews || '未計測'}
- 投稿数: ${i.postsCount}
- 最も伸びた投稿: ${i.bestPost || '未記入'}
- 伸びなかった投稿: ${i.worstPost || '未記入'}
- 今月試したこと: ${i.tried || '特になし'}

# 出力フォーマット
## 1. 今月のひとこと総評（3行以内）
## 2. 数字から読み取れること（良かった点・課題点を各2〜3個、必ず数字を根拠に）
## 3. 伸びた/伸びなかった投稿の仮説（なぜそうなったか）
## 4. 来月の施策 3つ（それぞれ「何を・いつ・どう測るか」まで具体的に）
## 5. 来月の投稿ネタ 5案（1行ずつ。サークルの活動テーマに沿って）

# 注意
- 学生が週数時間で運用している前提で、無理のない施策に
- 「バズらせる」より「入会・イベント参加につなげる」ことを優先`;
}

// ---------- メディアキット用テキスト ----------
export type MetricRow = {
  month: string;
  followers: number | null;
  reach: number | null;
  profile_views: number | null;
  posts_count: number | null;
  best_post: string | null;
};

export function buildMediaKitText(rows: MetricRow[]): string {
  const fmt = (n: number | null) => (n == null ? '—' : n.toLocaleString('ja-JP'));
  const lines = rows.map((r) => {
    const m = new Date(r.month + 'T00:00:00');
    const label = `${m.getFullYear()}年${m.getMonth() + 1}月`;
    return `- ${label}: フォロワー ${fmt(r.followers)}人 / リーチ ${fmt(r.reach)} / プロフィール閲覧 ${fmt(r.profile_views)} / 投稿 ${fmt(r.posts_count)}本`;
  });
  const latest = rows[0];
  return `【Green Sophia Instagram 実績サマリー】
上智大学環境活動サークル Green Sophia（@greensophia_insta）

■ 最新の規模
フォロワー: ${fmt(latest?.followers ?? null)}人 / 直近月間リーチ: ${fmt(latest?.reach ?? null)}

■ 月次推移
${lines.join('\n')}

■ アカウントの特徴
・学生サークルとしては国内有数の規模の環境系アカウント
・ビーチクリーン、環境×アート、企業コラボ、学食コラボなど幅広い企画力
・Podcast「GSラジオ」、姉妹アカウント「旅するGreen」等のメディア展開

※本データはInstagramインサイトに基づく自社集計です。`;
}
// ---------- 画像生成プロンプト（ChatGPT / Gemini 用） ----------
export type ImagePromptInput = {
  theme: string;
  detail: string;
  mood: string;      // 雰囲気キーワード（水彩風、パステル 等）
  slideRole: string;  // 表紙 / 中面 / まとめ 等
};

export function buildImagePrompt(i: ImagePromptInput): string {
  return `Instagram投稿用の画像を1枚生成してください。

【内容】
${i.theme}${i.detail ? `（${i.detail}）` : ''}をテーマにした、${i.slideRole || '投稿用'}の画像。

【雰囲気・スタイル】
${i.mood || 'やわらかい水彩・パステルカラー、手描き風のイラストテイスト'}。
説教くさくなく、親しみやすい印象。学生サークルらしい温かみのある表現。

【構図・技術指定】
- 正方形（1:1）またはInstagram縦長（4:5）に収まる構図
- 文字は入れず、イラスト・写真的な要素のみで構成
- 背景に強すぎるコントラストを避け、Canva上で文字を後から重ねられる余白を左右または上下に残す
- 色数は3〜4色程度に抑え、統一感のある配色にする

【避けたいこと】
- 過度にリアルで生々しい表現
- 特定の実在ブランドロゴや商標
- 文字・ロゴ・透かしの生成`;
}
