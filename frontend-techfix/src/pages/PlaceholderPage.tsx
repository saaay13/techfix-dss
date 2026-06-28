export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">Módulo en construcción</p>
    </div>
  );
}
