import { PhaseStub } from '@/components/layout/PhaseStub';

export default function ProjectExplorerPage({ params }: { params: { slug: string } }) {
  return (
    <PhaseStub
      phase={5}
      feature={`File explorer for ${params.slug}.`}
      description="Files grouped by room for the selected date, with chunked uploads, lazy thumbnails, and role-gated delete."
    />
  );
}
