import GalleryClient from './gallery-client';

export const metadata = {
  title: 'ギャラリー | matou AI Photo Studio',
};

export default function GalleryPage({ params }: { params: { jobId: string } }) {
  return <GalleryClient jobId={params.jobId} />;
}
