'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getScene } from '@/lib/scenes';
import { priceForCount, formatJPY } from '@/lib/pricing';

type PhotoInfo = {
  id: string;
  variationLabel: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  paid: boolean;
};

type JobInfo = {
  id: string;
  sceneId: string;
  status: 'processing' | 'done' | 'error';
  demoGeneration: boolean;
  photos: PhotoInfo[];
};

export default function GalleryClient({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch(`/api/job/${jobId}`, { cache: 'no-store' });
      if (res.status === 404) {
        setNotFound(true);
        return null;
      }
      const json = (await res.json()) as JobInfo;
      setJob(json);
      return json;
    } catch {
      return null;
    }
  }, [jobId]);

  // 生成中は3秒間隔でポーリング
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;
    const tick = async () => {
      const j = await fetchJob();
      if (stopped) return;
      if (!j || j.status === 'processing') {
        timer = setTimeout(tick, 3000);
      }
    };
    tick();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [fetchJob]);

  const scene = useMemo(() => (job ? getScene(job.sceneId) : undefined), [job]);
  const doneCount = job?.photos.filter((p) => p.status === 'done').length ?? 0;
  const totalCount = job?.photos.length ?? 0;
  const selectable = job?.photos.filter((p) => p.status === 'done' && !p.paid) ?? [];
  const total = priceForCount(selected.size);

  function toggle(photoId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  }

  async function checkout() {
    if (selected.size === 0 || checkingOut) return;
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, photoIds: Array.from(selected) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '決済の開始に失敗しました');
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : '決済の開始に失敗しました');
      setCheckingOut(false);
    }
  }

  if (notFound) {
    return (
      <main className="container center" style={{ padding: '6rem 1.5rem', minHeight: '60vh' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>ギャラリーが見つかりません</h2>
        <p className="hint">URLをご確認いただくか、もう一度撮影をお試しください。</p>
        <a href="/studio" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          撮影をはじめる
        </a>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="container center" style={{ padding: '6rem 1.5rem', minHeight: '60vh' }}>
        <div className="spinner" />
        <p className="hint">ギャラリーを読み込んでいます…</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '70vh' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div className="section-header">
          <h2>
            {scene?.emoji} {scene?.name ?? 'ギャラリー'}
          </h2>
          {job.status === 'processing' ? (
            <p>
              プロのAIフォトグラファーが仕上げています… {doneCount} / {totalCount} 枚完成
            </p>
          ) : (
            <p>お気に入りの写真を選んで高解像度データをダウンロードできます</p>
          )}
        </div>

        {job.status === 'processing' && (
          <div className="progress-bar">
            <div className="fill" style={{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }} />
          </div>
        )}

        {job.demoGeneration && (
          <div className="notice">
            🔧 デモモードで動作中です(GEMINI_API_KEY 未設定)。実際のAI生成の代わりに加工画像を表示しています。
          </div>
        )}

        <div className="notice">
          プレビューには透かしが入っています。ご購入いただくと、透かしなしの高解像度データをダウンロードできます。
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="photo-grid" style={{ paddingBottom: '6rem' }}>
          {job.photos.map((photo) => {
            const isSelectable = photo.status === 'done' && !photo.paid;
            const isSelected = selected.has(photo.id);
            return (
              <div
                key={photo.id}
                className={`photo-card${isSelectable ? ' selectable' : ''}${isSelected ? ' selected' : ''}`}
                onClick={() => isSelectable && toggle(photo.id)}
              >
                {photo.status === 'done' ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/preview/${job.id}/${photo.id}`} alt={photo.variationLabel} loading="lazy" />
                    {isSelectable && <div className="check">✓</div>}
                  </>
                ) : (
                  <div className="photo-skeleton" />
                )}
                <div className="ph-body">
                  <span className="label">{photo.variationLabel}</span>
                  {photo.paid && <span className="badge badge-paid">購入済み</span>}
                  {(photo.status === 'pending' || photo.status === 'generating') && (
                    <span className="badge badge-generating">生成中…</span>
                  )}
                  {photo.status === 'error' && <span className="badge badge-error">生成失敗</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectable.length > 0 && (
        <div className="checkout-bar">
          <div className="inner">
            <div>
              <div className="total">
                {selected.size}枚選択中
                <strong>{selected.size > 0 ? formatJPY(total) : '—'}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: '0.4rem' }}>(税込)</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                まとめ買いで自動的にお得なパック料金が適用されます
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelected(new Set(selectable.map((p) => p.id)))}
              >
                すべて選択
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={selected.size === 0 || checkingOut}
                onClick={checkout}
              >
                {checkingOut ? '処理中…' : 'ダウンロード購入へ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
