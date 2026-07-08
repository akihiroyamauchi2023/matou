'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SCENES, getScene } from '@/lib/scenes';

type Step = 'scene' | 'photo' | 'count' | 'generating';

export default function StudioClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialScene = searchParams.get('scene');
  const [step, setStep] = useState<Step>(initialScene && getScene(initialScene) ? 'photo' : 'scene');
  const [sceneId, setSceneId] = useState<string | null>(initialScene && getScene(initialScene) ? initialScene : null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [count, setCount] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [dragover, setDragover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scene = useMemo(() => (sceneId ? getScene(sceneId) : undefined), [sceneId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function acceptFile(f: File | undefined | null) {
    setError(null);
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('JPEG / PNG / WebP 形式の画像をアップロードしてください');
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setError('画像サイズは15MB以下にしてください');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function startGeneration() {
    if (!scene || !file) return;
    setStep('generating');
    setError(null);
    try {
      const form = new FormData();
      form.append('sceneId', scene.id);
      form.append('count', String(count));
      form.append('photo', file);
      const res = await fetch('/api/generate', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '生成の開始に失敗しました');
      router.push(`/gallery/${json.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成の開始に失敗しました');
      setStep('count');
    }
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'scene', label: 'シーン選択' },
    { key: 'photo', label: '写真アップロード' },
    { key: 'count', label: '枚数指定' },
    { key: 'generating', label: '生成' },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <main className="container" style={{ minHeight: '70vh', paddingBottom: '4rem' }}>
      <div className="studio-progress">
        {steps.map((s, i) => (
          <span key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <span className="p-line" />}
            <span className={`p-step${i === stepIndex ? ' active' : ''}${i < stepIndex ? ' done' : ''}`}>
              <span className="dot">{i < stepIndex ? '✓' : i + 1}</span>
              <span className="txt">{s.label}</span>
            </span>
          </span>
        ))}
      </div>

      {error && <div className="error-box">{error}</div>}

      {step === 'scene' && (
        <>
          <div className="section-header">
            <h2>シーンを選ぶ</h2>
            <p>お作りしたい写真のシーンをお選びください</p>
          </div>
          <div className="scene-grid">
            {SCENES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`scene-card${sceneId === s.id ? ' selected' : ''}`}
                style={{ textAlign: 'left', fontFamily: 'inherit' }}
                onClick={() => {
                  setSceneId(s.id);
                  setStep('photo');
                }}
              >
                <span className="emoji">{s.emoji}</span>
                <div className="en">{s.nameEn}</div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'photo' && scene && (
        <>
          <div className="section-header">
            <h2>
              {scene.emoji} {scene.name}
            </h2>
            <p>お顔がはっきり写った写真を1枚アップロードしてください</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />

          {!previewUrl ? (
            <div
              className={`upload-zone${dragover ? ' dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragover(true);
              }}
              onDragLeave={() => setDragover(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragover(false);
                acceptFile(e.dataTransfer.files?.[0]);
              }}
            >
              <div className="icon">📷</div>
              <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>クリックまたはドラッグ&ドロップで写真を選択</p>
              <p className="hint">JPEG / PNG / WebP、15MBまで。スマホで撮った写真でOKです。</p>
            </div>
          ) : (
            <div className="center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="アップロードした写真" className="upload-preview" />
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                  別の写真にする
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep('count')}>
                  この写真ですすむ
                </button>
              </div>
            </div>
          )}

          <div className="center" style={{ marginTop: '2rem' }}>
            <button
              type="button"
              className="btn"
              style={{ color: 'var(--muted)' }}
              onClick={() => setStep('scene')}
            >
              ← シーン選択にもどる
            </button>
          </div>
        </>
      )}

      {step === 'count' && scene && (
        <>
          <div className="section-header">
            <h2>生成する枚数</h2>
            <p>
              {scene.name}は最大{scene.maxCount}枚まで。背景やライティングの異なるカットを生成します。
            </p>
          </div>
          <div className="count-selector">
            {Array.from({ length: scene.maxCount }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={count === n ? 'selected' : ''} onClick={() => setCount(n)}>
                {n}
              </button>
            ))}
          </div>
          <p className="hint">生成とプレビューは無料です。お支払いはダウンロードする写真を選んでから。</p>

          <div style={{ maxWidth: 560, margin: '2rem auto 0' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>生成されるカットの例:</p>
            <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.4rem' }}>
              {scene.variations.slice(0, count).map((v) => (
                <li key={v.id}>{v.label}</li>
              ))}
            </ul>
          </div>

          <div className="center" style={{ marginTop: '2.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep('photo')}>
              ← もどる
            </button>
            <button type="button" className="btn btn-primary btn-lg" onClick={startGeneration}>
              {count}枚を無料で生成する
            </button>
          </div>
        </>
      )}

      {step === 'generating' && (
        <div className="center" style={{ padding: '4rem 0' }}>
          <div className="spinner" />
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>スタジオを準備しています…</h2>
          <p className="hint">まもなくギャラリーページに移動します</p>
        </div>
      )}
    </main>
  );
}
