import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = db();
  const [{ count: stockCount }, { data: recent }] = await Promise.all([
    supabase.from('stocks').select('*', { count: 'exact', head: true }),
    supabase.from('stocks').select('id, type, note, url, created_at').order('created_at', { ascending: false }).limit(3),
  ]);

  const typeLabel: Record<string, { cls: string; label: string }> = {
    design: { cls: 'tag-design', label: 'Ref. Design' },
    sponsor: { cls: 'tag-sponsor', label: 'Sponsor' },
    inbox: { cls: 'tag-inbox', label: 'Memo' },
  };

  return (
    <main className="container">
      <section className="masthead">
        <div className="eyebrow">Green Sophia / SNS Editorial Desk</div>
        <h1>調べて、記録して、<span className="serif-it">ひろげる。</span></h1>
        <p className="lede">
          "Learn with us, act with Green Sophia, inspire others."
          共に学び、共に行動することで、誰かを刺激する——その理念を、日々の運用に落とし込むためのデスクです。
        </p>
      </section>

      <div className="card-grid">
        <a href="/stocks">
          <div className="card">
            <div className="eyebrow">01 / Learn</div>
            <h2>ためる</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              LINEに送った参考スクショ・記事のストック。
              <br /><span className="mono" style={{ fontSize: '.8rem' }}>現在 {stockCount ?? 0} 件</span>
            </p>
          </div>
        </a>
        <a href="/prompts/post">
          <div className="card">
            <div className="eyebrow">02 / Act</div>
            <h2>つくる</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              条件を選ぶだけで、Claudeに渡す投稿プロンプトを組み立てます。
            </p>
          </div>
        </a>
        <a href="/metrics">
          <div className="card">
            <div className="eyebrow">03 / Inspire</div>
            <h2>ひろげる</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              月次実績を記録し、コラボ提案用の資料として出力します。
            </p>
          </div>
        </a>
      </div>

      <div className="divider-leaf"><span>Recent Stocks</span></div>

      <div className="card">
        {!recent?.length ? (
          <div className="empty">
            まだ記録がありません。サークルのLINE Botにスクショや記事URLを送ると、ここに集まります。
          </div>
        ) : (
          recent.map((s) => {
            const t = typeLabel[s.type] ?? typeLabel.inbox;
            return (
              <div className="stock-item" key={s.id}>
                <div>
                  <span className={`tag ${t.cls}`}>{t.label}</span>
                  <p style={{ margin: '8px 0 4px' }}>{s.note || s.url || '（メモなし）'}</p>
                  <span className="stock-meta">
                    {new Date(s.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div style={{ marginTop: 16 }}>
          <a href="/stocks" className="btn btn-sm">すべて見る</a>
        </div>
      </div>
    </main>
  );
}
