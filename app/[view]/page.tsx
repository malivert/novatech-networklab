import { NetworkLabApp } from "@/components/NetworkLabApp";
import { isStaticViewSegment, STATIC_VIEW_SEGMENTS } from "@/lib/navigation";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return STATIC_VIEW_SEGMENTS.map((view) => ({ view }));
}

export default async function NetworkLabViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  if (!isStaticViewSegment(view)) notFound();

  return <NetworkLabApp />;
}
