export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20"></div>
        <div className="absolute top-0 h-10 w-10 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
      </div>
    </div>
  );
}
