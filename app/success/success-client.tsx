'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type PaidPhoto = { id: string; variationLabel: string };

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const sessionId = searchParams.get('session_id');
  const demo = searchParams.get('demo') === '1';
  const demoPhotoIds = (searchParams.get('photoIds') ?? '').split(',').filter(Boolean);

  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState<PaidPhoto[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!jobId) {
      setState('error');
      setMessage('購入情報が見つかりません');
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            demo ? { jobId, demo: true, photoIds: demoPhotoIds } : { jobId, sessionId }
          ),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || '決済確認に失敗しました');
        setPhotos(json.photos);
        setToken(json.downloadToken);
        setState('ok');
      } catch (err) {
        setState('error');
        setMessage(err instanceof Error ? err.message : '決済確認に失敗しました');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, sessionId, demo]);

  if (state === 'loading') {
    return (
      <main className="container center" style={{ padding: '6rem 1.5rem', minHeight: '60vh' }}>
        <div className="spinner" />
        <p className="hint">お支払いを確認しています…</p>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main className="container center" style={{ padding: '6rem 1.5rem', minHeight: '60vh' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>確認できませんでした</h2>
        <p className="hint">{message}</p>
        {jobId && (
          <Link href={`/gallery/${jobId}`} className="btn btn-primary" style={{ marginTop: '2rem' }}>
            ギャラリーにもどる
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem 5rem', minHeight: '60vh' }}>
      <div className="section-header">
        <h2>🎉 ご購入ありがとうございます</h2>
        <p>
          {demo
            ? 'デモ決済が完了しました(Stripe未設定のためテスト動作です)。'
            : 'お支払いが完了しました。'}
          高解像度データ(透かしなし)をダウンロードできます。
        </p>
      </div>

      <div className="photo-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
        {photos.map((p) => (
          <div key={p.id} className="photo-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/preview/${jobId}/${p.id}`} alt={p.variationLabel} />
            <div className="ph-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem' }}>
              <span className="label center">{p.variationLabel}</span>
              <a
                href={`/api/download/${jobId}/${p.id}?token=${token}`}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                download
              >
                ⬇ 高解像度ダウンロード
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="center" style={{ marginTop: '3rem', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={`/gallery/${jobId}`} className="btn btn-outline">
          ギャラリーにもどる
        </Link>
        <Link href="/studio" className="btn btn-primary">
          べつのシーンでも撮影する
        </Link>
      </div>

      <p className="hint" style={{ marginTop: '2rem' }}>
        ※ このページのURLをブックマークしておくと、あとからでも再ダウンロードできます。
      </p>
    </main>
  );
}
