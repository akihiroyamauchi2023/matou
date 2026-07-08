import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'matou AI Photo Studio | AIが仕上げるプロ品質の記念写真',
  description:
    'プロフィール写真・七五三・結婚式前撮り・遺影写真など、シーンを選んで写真をアップロードするだけ。AIが超一流のプロ写真家品質の記念写真に仕上げます。プレビュー無料、ダウンロード時のみ課金。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="inner">
            <Link href="/" className="brand">
              matou
              <small>AI PHOTO STUDIO</small>
            </Link>
            <nav className="header-nav">
              <Link href="/#scenes">シーン一覧</Link>
              <Link href="/#pricing">料金</Link>
              <Link href="/studio">撮影をはじめる</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="brand">matou</div>
          <p>AI PHOTO STUDIO — あなたの一枚を、一生の一枚に。</p>
          <p style={{ marginTop: '0.8rem', opacity: 0.6 }}>&copy; 2026 matou | THE NEXT GENERATION OF PHOTOGRAPHY</p>
        </footer>
      </body>
    </html>
  );
}
