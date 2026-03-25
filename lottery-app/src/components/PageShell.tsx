export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="px-6 py-10">{children}</main>;
}