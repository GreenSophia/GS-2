'use client';
import { useMemo, useState } from 'react';
import { buildPostPrompt } from '@/lib/prompts';

const TARGETS = ['環境に興味がある大学生', '新入生（入会検討中）', 'サークルをよく知らない一般学生', 'コラボ先の企業・団体', 'すでにフォローしてくれている人'];
const GOALS = ['イベント参加を増やす', '入会DMにつなげる', '保存されるお役立ち投稿にする', 'フォロワーを増やす', '活動をと報告する'];

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="chips" role="radiogroup">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          className={`chip ${value === o ? 'on' : ''}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function PostPromptPage() {
  const [theme, setTheme] = useState('');
  const [detail, setDetail] = useState('');
  const [target, setTarget] = useState(TARGETS[0]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [slides, setSlides] = useState(6);
  const [cta, setCta] = useState('');
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => buildPostPrompt({ theme, detail, target, slides, goal, cta }),
    [theme, detail, target, slides, goal, cta]
  );

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="container">
      <section className="masthead">
        <div className="eyebrow">02　ACT — 投稿</div>
        <h1>投稿プロンプトメーカー</h1>
        <p className="lede">
          条件を入力するだけで、Claudeに渡す投稿作成用の指示文を組み立てます。
          出力した原稿は<a href="/portal">Canva棚</a>のテンプレートに流し込みます。
        </p>
      </section>

      <div className="card">
        <div className="field">
          <label>1. なにについての投稿？ <span className="hint">自由に入力してください</span></label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="例: 鵠沼海岸でのビーチクリーン / 廃コスメを使った環境アート など"
          />
        </div>
        <div className="field">
          <label>
            2. くわしい内容 <span className="hint">日時・場所・伝えたいことなど。空欄でもOK</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="例: 7/11(土) 16-19時 鵠沼海岸でビーチクリーン。スイカ割りとアクセサリーWSも。持ち物は軍手。"
          />
        </div>
        <div className="field">
          <label>3. 情報の届け手？</label>
          <Chips options={TARGETS} value={target} onChange={setTarget} />
        </div>
        <div className="field">
          <label>4. 投稿のゴール</label>
          <Chips options={GOALS} value={goal} onChange={setGoal} />
        </div>
        <div className="field" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 150px' }}>
            <label>5. 画像の枚数</label>
            <input
              type="number"
              min={1}
              max={10}
              value={slides}
              onChange={(e) => setSlides(Number(e.target.value))}
            />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label>
              6. 読者にしてほしい行動 <span className="hint">空欄なら定番CTAに</span>
            </label>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="例: ストーリーズのリンクから参加申込"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>できあがったプロンプト</h2>
          <button className="btn btn-primary btn-sm" onClick={copy}>
            {copied ? 'コピー完了' : 'Claudeへコピー'}
          </button>
        </div>
        <div className="prompt-out">{prompt}</div>
      </div>
      {copied && <div className="toast">クリップボードにコピーしました</div>}
    </main>
  );
}
