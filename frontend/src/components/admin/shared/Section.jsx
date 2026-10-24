export default function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      {children}
    </section>
  );
}
