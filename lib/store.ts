// シンプルなファイルベースのジョブストア。
// 本番でスケールさせる場合は S3/Cloud Storage + DB への置き換えを想定した薄い層。
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export type PhotoStatus = 'pending' | 'generating' | 'done' | 'error';

export type Photo = {
  id: string;
  variationId: string;
  variationLabel: string;
  status: PhotoStatus;
  error?: string;
};

export type Job = {
  id: string;
  sceneId: string;
  count: number;
  createdAt: string;
  status: 'processing' | 'done' | 'error';
  photos: Photo[];
  // 課金: 購入済み写真IDの集合
  paidPhotoIds: string[];
  demoGeneration: boolean;
  downloadToken: string;
};

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');

function jobDir(jobId: string) {
  // パストラバーサル防止: UUID形式のみ許可
  if (!/^[0-9a-f-]{36}$/.test(jobId)) throw new Error('invalid job id');
  return path.join(DATA_DIR, 'jobs', jobId);
}

export async function createJob(sceneId: string, count: number, demoGeneration: boolean): Promise<Job> {
  const id = crypto.randomUUID();
  const job: Job = {
    id,
    sceneId,
    count,
    createdAt: new Date().toISOString(),
    status: 'processing',
    photos: [],
    paidPhotoIds: [],
    demoGeneration,
    downloadToken: crypto.randomBytes(24).toString('hex'),
  };
  await fs.mkdir(jobDir(id), { recursive: true });
  await saveJob(job);
  return job;
}

// ジョブ単位で保存を直列化(並列ワーカーによる一時ファイルのrename競合を防ぐ)
const saveQueues = new Map<string, Promise<void>>();

export function saveJob(job: Job): Promise<void> {
  const prev = saveQueues.get(job.id) ?? Promise.resolve();
  const next = prev.then(() => writeJobFile(job)).catch((err) => {
    console.error(`[store] failed to save job ${job.id}:`, err);
  });
  saveQueues.set(job.id, next);
  return next;
}

async function writeJobFile(job: Job): Promise<void> {
  const file = path.join(jobDir(job.id), 'job.json');
  // 別経路(Webhook等)で追記された購入記録を失わないようマージ
  try {
    const onDisk = JSON.parse(await fs.readFile(file, 'utf8')) as Job;
    job.paidPhotoIds = Array.from(new Set([...onDisk.paidPhotoIds, ...job.paidPhotoIds]));
  } catch {
    /* 初回保存 */
  }
  const tmp = `${file}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(job, null, 2));
  await fs.rename(tmp, file);
}

export async function loadJob(jobId: string): Promise<Job | null> {
  try {
    const raw = await fs.readFile(path.join(jobDir(jobId), 'job.json'), 'utf8');
    return JSON.parse(raw) as Job;
  } catch {
    return null;
  }
}

export async function saveSourceImage(jobId: string, buf: Buffer, ext: string): Promise<void> {
  await fs.writeFile(path.join(jobDir(jobId), `source${ext}`), buf);
}

export async function loadSourceImage(jobId: string): Promise<Buffer | null> {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    try {
      return await fs.readFile(path.join(jobDir(jobId), `source${ext}`));
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function savePhotoImage(jobId: string, photoId: string, buf: Buffer): Promise<void> {
  if (!/^[0-9a-f-]{36}$/.test(photoId)) throw new Error('invalid photo id');
  await fs.writeFile(path.join(jobDir(jobId), `${photoId}.jpg`), buf);
}

export async function loadPhotoImage(jobId: string, photoId: string): Promise<Buffer | null> {
  if (!/^[0-9a-f-]{36}$/.test(photoId)) return null;
  try {
    return await fs.readFile(path.join(jobDir(jobId), `${photoId}.jpg`));
  } catch {
    return null;
  }
}

// 購入記録の永続化(ジョブ更新の競合を避けるため読み直してマージ)
export async function markPhotosPaid(jobId: string, photoIds: string[]): Promise<Job | null> {
  const job = await loadJob(jobId);
  if (!job) return null;
  const set = new Set([...job.paidPhotoIds, ...photoIds]);
  job.paidPhotoIds = Array.from(set);
  await saveJob(job);
  return job;
}
