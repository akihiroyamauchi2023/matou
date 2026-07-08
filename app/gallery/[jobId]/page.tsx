import GalleryClient from './gallery-client';

export const metadata = {
  title: 'ギャラリー | AI Photo Studio',
};

export default function GalleryPage({ params }: { params: { jobId: string } }) {
  return <GalleryClient jobId={params.jobId} />;
}
