import Link from 'next/link';
import { SCENES } from '@/lib/scenes';
import { PRICE_TIERS, formatJPY } from '@/lib/pricing';

export default function HomePage() {
  return (
    <main>
      <div className="hero">
        <h1>matou</h1>
        <p className="tagline">AI PHOTO STUDIO — あなたの一枚を、一生の一枚に。</p>
        <p className="sub">
          プロフィール写真から七五三、結婚式前撮り、遺影写真まで。
          シーンを選んで手元の写真をアップロードするだけで、AIが超一流のプロ写真家が撮影したような記念写真に仕上げます。
        </p>
        <div className="hero-badges">
          <span>生成・プレビュー無料</span>
          <span>スタジオ予約不要</span>
          <span>最短1分で完成</span>
          <span>1枚330円〜</span>
        </div>
        <Link href="/studio" className="btn btn-primary btn-lg">
          無料で撮影をはじめる
        </Link>
      </div>

      <section className="page-section" id="scenes">
        <div className="container">
          <div className="section-header">
            <h2>SCENES</h2>
            <p>人生の大切な瞬間に寄り添う、9つの撮影シーン</p>
          </div>
          <div className="scene-grid">
            {SCENES.map((scene) => (
              <Link key={scene.id} href={`/studio?scene=${scene.id}`} className="scene-card">
                <span className="emoji">{scene.emoji}</span>
                <div className="en">{scene.nameEn}</div>
                <h3>{scene.name}</h3>
                <p>{scene.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>HOW IT WORKS</h2>
            <p>むずかしい操作は一切ありません</p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="num">1</div>
              <h3>シーンを選ぶ</h3>
              <p>プロフィール・七五三・前撮り・遺影など9シーンから選択</p>
            </div>
            <div className="flow-step">
              <div className="num">2</div>
              <h3>写真をアップロード</h3>
              <p>スマホで撮った写真でOK。お顔がはっきり写った1枚を</p>
            </div>
            <div className="flow-step">
              <div className="num">3</div>
              <h3>枚数を指定して生成</h3>
              <p>背景・ライティング・構図の異なるプロ品質カットをAIが生成</p>
            </div>
            <div className="flow-step">
              <div className="num">4</div>
              <h3>気に入った写真だけ購入</h3>
              <p>プレビューは無料。高解像度ダウンロード時のみお支払い</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>PRICING</h2>
            <p>生成もプレビューも無料。お支払いは気に入った写真のダウンロード時だけ。</p>
          </div>
          <div className="price-grid">
            {PRICE_TIERS.map((tier, i) => (
              <div key={tier.count} className={`price-card${i === 2 ? ' popular' : ''}`}>
                {i === 2 && <div className="pop-badge">人気No.1</div>}
                <h3>{tier.label}</h3>
                <div className="amount">{formatJPY(tier.price)}</div>
                <div className="per">
                  1枚あたり {formatJPY(Math.round(tier.price / tier.count))}(税込)
                </div>
              </div>
            ))}
          </div>
          <p className="hint" style={{ marginTop: '1.5rem' }}>
            ※ 選択枚数に応じて、最もお得なパック料金が自動で適用されます
          </p>
        </div>
      </section>

      <section className="page-section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>FAQ</h2>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Q. 本当に無料で試せますか?</h3>
              <p>
                A. はい。写真の生成と透かし入りプレビューの閲覧は完全無料です。料金が発生するのは、気に入った写真の高解像度データ(透かしなし)をダウンロードするときだけです。
              </p>
            </div>
            <div className="faq-item">
              <h3>Q. どんな写真をアップロードすればいいですか?</h3>
              <p>
                A. お顔が正面からはっきり写った、明るい場所で撮影された写真がおすすめです。スマートフォンで撮影した写真で十分です(JPEG / PNG / WebP、15MBまで)。
              </p>
            </div>
            <div className="faq-item">
              <h3>Q. アップロードした写真はどう扱われますか?</h3>
              <p>
                A. アップロードされた写真は生成処理のためだけに使用します。第三者への提供や学習への利用は行いません。
              </p>
            </div>
            <div className="faq-item">
              <h3>Q. 遺影写真も作れますか?</h3>
              <p>
                A. はい。お手持ちのスナップ写真から、正装への衣装変更や背景の整った格調あるお写真をお作りできます。生前のご準備(終活)にもご利用いただけます。
              </p>
            </div>
          </div>
          <div className="center" style={{ marginTop: '2.5rem' }}>
            <Link href="/studio" className="btn btn-primary btn-lg">
              無料で撮影をはじめる
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
