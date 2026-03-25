import Link from "next/link";

interface ModuleLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function ModuleLayout({ title, subtitle, children }: ModuleLayoutProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          &larr; Back to modules
        </Link>
      </nav>
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">{subtitle}</p>
      </header>
      {children}
    </main>
  );
}
