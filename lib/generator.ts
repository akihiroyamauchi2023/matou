// 生成ジョブの実行エンジン。
// APIリクエストはジョブ作成後すぐ返し、本処理はバックグラウンドで並列実行する。
// クライアントは /api/job/[jobId] をポーリングして進捗を取得する。
import crypto from 'crypto';
import { buildPrompt, getScene } from './scenes';
import { generatePhoto, isDemoGeneration } from './gemini';
import { createJob, loadSourceImage, saveJob, savePhotoImage, saveSourceImage, type Job } from './store';

// 同時実行数。無料枠は1分あたりの回数制限が厳しいため、既定は1(逐次)にして
// レート制限を避ける。課金を有効化して高速化したい場合は GEN_CONCURRENCY で増やせる。
const CONCURRENCY = Math.max(1, Number(process.env.GEN_CONCURRENCY) || 1);

export async function startGenerationJob(sceneId: string, count: number, sourceImage: Buffer, ext: string): Promise<Job> {
  const scene = getScene(sceneId);
  if (!scene) throw new Error('unknown scene');
  const n = Math.max(1, Math.min(count, scene.maxCount));

  const job = await createJob(sceneId, n, isDemoGeneration());
  await saveSourceImage(job.id, sourceImage, ext);

  job.photos = Array.from({ length: n }, (_, i) => ({
    id: crypto.randomUUID(),
    variationLabel: scene.variations[i % scene.variations.length].label,
    status: 'pending' as const,
  }));
  await saveJob(job);

  // fire-and-forget: リクエストを塞がずにバックグラウンドで生成
  void runJob(job).catch(async (err) => {
    job.status = 'error';
    await saveJob(job).catch(() => {});
    console.error(`[generator] job ${job.id} failed:`, err);
  });

  return job;
}

async function runJob(job: Job): Promise<void> {
  const scene = getScene(job.sceneId)!;
  const source = await loadSourceImage(job.id);
  if (!source) throw new Error('source image missing');

  let cursor = 0;
  const worker = async () => {
    while (cursor < job.photos.length) {
      const index = cursor++;
      const photo = job.photos[index];
      photo.status = 'generating';
      await saveJob(job);
      try {
        const { prompt } = buildPrompt(scene, index);
        const image = await generatePhoto(source, prompt);
        await savePhotoImage(job.id, photo.id, image);
        photo.status = 'done';
      } catch (err) {
        photo.status = 'error';
        photo.error = err instanceof Error ? err.message : String(err);
        console.error(`[generator] photo ${photo.id} failed:`, err);
      }
      await saveJob(job);
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, job.photos.length) }, worker));

  job.status = job.photos.some((p) => p.status === 'done') ? 'done' : 'error';
  await saveJob(job);
}
