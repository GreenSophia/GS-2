import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = db();
  const [{ count: stockCount }, { data: recent }] = await Promise.all([
    supabase.from('stocks').select('*', { count: 'exact', head: true }),
    supabase.from('stocks').select('id, type, note, url, created_at').order('created_at', { ascending: false }).limit(3),
  ]);

  const typeLabel: Record<string, { cls: string; label: string }> = {
    design: { cls: 'tag-design', label: '参考デザイン' },
    sponsor: { cls: 'tag-sponsor', label: 'スポンサー候補' },
    inbox: { cls: 'tag-inbox', label: 'メモ' },
  };

  return (
    <main className="container">
      <section className="masthead">
        <div className="eyebrow">SNS RUNNING DESK</div>
        <h1>日々の活動を記録し、<br />発信につなげるための運用拠点。</h1>
        <p className="lede">
          参考事例の収集から、投稿案の作成、実績の記録までを一つの場所に。
          Green Sophia の発信活動を、無理なく続けられる形に整えます。
        </p>
      </section>

      <div className="card-grid">
        <a href="/stocks">
          <div className="card">
            <div className="eyebrow">01　ためる</div>
            <h2>収集</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              LINEに送った参考スクリーンショットや記事を蓄積します。
              <br /><span style={{ fontSize: '.82rem' }}>現在 {stockCount ?? 0} 件</span>
            </p>
          </div>
        </a>
        <a href="/prompts/post">
          <div className="card">
            <div className="eyebrow">02　つくる</div>
            <h2>作成</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              条件を選ぶだけで、Claudeに渡す投稿プロンプトを組み立てます。
            </p>
          </div>
        </a>
        <a href="/metrics">
          <div className="card">
            <div className="eyebrow">03　ひろげる</div>
            <h2>記録</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              月次実績を記録し、企業提案用の資料として出力します。
            </p>
          </div>
        </a>
      </div>

      <div className="divider-leaf"><span>最近の収集</span></div>

      <div className="card">
        {!recent?.length ? (
          <div className="empty">
            まだ記録がありません。サークルのLINE Botにスクリーンショットや記事URLを送ると、ここに集まります。
          </div>
        ) : (
          recent.map((s) => {
            const t = typeLabel[s.type] ?? typeLabel.inbox;
            return (
              <div className="stock-item" key={s.id}>
                <div>
                  <span className={`tag ${t.cls}`}>{t.label}</span>
                  <p style={{ margin: '10px 0 4px' }}>{s.note || s.url || '（メモなし）'}</p>
                  <span className="stock-meta">
                    {new Date(s.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div style={{ marginTop: 18 }}>
          <a href="/stocks" className="btn btn-sm">すべて見る</a>
        </div>
      </div>
    </main>
  );
}
