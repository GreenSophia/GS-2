import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const TABS = [
  { key: 'all', label: 'すべて' },
  { key: 'design', label: '参考デザイン' },
  { key: 'sponsor', label: 'スポンサー候補' },
  { key: 'inbox', label: 'ひらめきメモ' },
] as const;

const TAG: Record<string, { cls: string; label: string }> = {
  design: { cls: 'tag-design', label: '参考デザイン' },
  sponsor: { cls: 'tag-sponsor', label: 'スポンサー候補' },
  inbox: { cls: 'tag-inbox', label: 'ひらめきメモ' },
};

async function deleteStock(formData: FormData) {
  'use server';
  await db().from('stocks').delete().eq('id', String(formData.get('id')));
  revalidatePath('/stocks');
}

async function retypeStock(formData: FormData) {
  'use server';
  await db()
    .from('stocks')
    .update({ type: String(formData.get('type')) })
    .eq('id', String(formData.get('id')));
  revalidatePath('/stocks');
}

export default async function StocksPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = 'all' } = await searchParams;
  let query = db().from('stocks').select('*').order('created_at', { ascending: false }).limit(100);
  if (tab !== 'all') query = query.eq('type', tab);
  const { data: stocks } = await query;

  const storageBase = `${process.env.SUPABASE_URL}/storage/v1/object/public/stocks/`;

  return (
    <main className="container">
      <section className="masthead">
        <div className="eyebrow">01　LEARN — 記録</div>
        <h1>記録</h1>
        <p className="lede">
          サークルのLINE Botに送った参考スクリーンショットや記事URLが、自動でここに集まります。
        </p>
      </section>

      <nav className="subnav" aria-label="記録内メニュー">
        {TABS.map((t) => (
          <a key={t.key} href={`/stocks?tab=${t.key}`} className={tab === t.key ? 'active' : ''}>
            {t.label}
          </a>
        ))}
      </nav>

      <div className="card tint-green">
        <p className="muted" style={{ margin: 0, fontSize: '.86rem' }}>
          画像は「参考デザイン」に自動分類されます。テキストの先頭に「スポンサー」または「デザイン」と書いてURLを送ると、それぞれの区分に振り分けられます。
        </p>
      </div>

      {!stocks?.length ? (
        <div className="empty">
          このカテゴリにはまだ記録がありません。気になったものをLINE Botに送ると、ここに集まります。
        </div>
      ) : (
        <div className="card">
          {stocks.map((s) => {
            const t = TAG[s.type] ?? TAG.inbox;
            return (
              <div className="stock-item" key={s.id}>
                {s.image_path && (
                  <a href={storageBase + s.image_path} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={storageBase + s.image_path} alt="ストック画像" />
                  </a>
                )}
                <div style={{ flex: 1 }}>
                  <span className={`tag ${t.cls}`}>{t.label}</span>
                  {s.note && <p style={{ margin: '8px 0 4px' }}>{s.note}</p>}
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.86rem', wordBreak: 'break-all' }}>
                      {s.url}
                    </a>
                  )}
                  <div className="stock-meta" style={{ marginTop: 6 }}>
                    {s.sent_by ? `${s.sent_by} さんから ・ ` : ''}
                    {new Date(s.created_at).toLocaleString('ja-JP', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <form action={retypeStock} style={{ display: 'flex', gap: 4 }}>
                    <input type="hidden" name="id" value={s.id} />
                    <select name="type" defaultValue={s.type} style={{ padding: '4px 8px', fontSize: '.78rem', width: 'auto' }}>
                      <option value="design">参考デザイン</option>
                      <option value="sponsor">スポンサー候補</option>
                      <option value="inbox">ひらめきメモ</option>
                    </select>
                    <button className="btn btn-ghost btn-sm" type="submit">移動</button>
                  </form>
                  <form action={deleteStock}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="btn btn-ghost btn-sm" type="submit">削除</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
