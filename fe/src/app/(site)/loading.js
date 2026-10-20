export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status">
      <span className="size-10 animate-spin rounded-full border-4 border-paper-200 border-t-orange-500" />
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}
