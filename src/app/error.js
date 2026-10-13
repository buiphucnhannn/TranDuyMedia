"use client";

import { useEffect } from "react";
import { Button, Container } from "@/components/ui";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Đã có lỗi xảy ra</h1>
      <p className="mt-4 max-w-md text-zinc-600">
        Xin lỗi, đã có sự cố khi tải trang. Vui lòng thử lại.
      </p>
      <div className="mt-10 flex gap-4">
        <Button onClick={() => reset()}>Thử lại</Button>
        <Button href="/" variant="outline">
          Về trang chủ
        </Button>
      </div>
    </Container>
  );
}
