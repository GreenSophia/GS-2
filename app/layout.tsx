import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Green Sophia — SNS Copilot',
  description: 'Green Sophia の発信活動を支える運用拠点',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="inner">
            <a href="/" className="brand" style={{ textDecoration: 'none' }}>
              <span className="logo-script">Green Sophia</span>
              <span className="kicker">SNS Copilot</span>
            </a>
            <nav className="nav" aria-label="メイン">
              <a href="/stocks">記録</a>
              <a href="/prompts/post">作成</a>
              <a href="/prompts/analysis">過去データ</a>
              <a href="/portal">Canva</a>
              <a href="/metrics">実績</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
