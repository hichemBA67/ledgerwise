import Link from "next/link";

/** Static-export-friendly redirect: meta refresh plus a visible link. */
export function RedirectPage({ to, label }: { to: string; label: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <meta httpEquiv="refresh" content={`0; url=${base}${to}`} />
      <p className="text-[17px] text-muted">
        This page has moved to{" "}
        <Link href={to} className="font-semibold text-accent hover:underline">
          {label}
        </Link>
        .
      </p>
    </div>
  );
}
