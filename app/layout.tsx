import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Green Sophia — SNS Copilot',
  description: 'Learn with us, act with Green Sophia, inspire others.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="inner">
            <a href="/" className="brand">
              <span className="logo-script">Green Sophia</span>
              <span className="kicker">SNS Desk</span>
            </a>
            <nav className="nav" aria-label="メイン">
              <a href="/stocks">ためる</a>
              <a href="/prompts/post">つくる</a>
              <a href="/prompts/analysis">ふりかえる</a>
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
