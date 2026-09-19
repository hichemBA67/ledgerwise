import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="font-mono text-[13px] text-token">Settlement fail · 404</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">This page didn’t settle</h1>
      <p className="mt-4 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <Link href="/learn" className="mt-8 inline-block rounded-xl bg-ink px-5 py-3 font-semibold text-bg">
        Back to the curriculum
      </Link>
    </div>
  );
}
