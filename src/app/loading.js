export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <span className="size-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}
