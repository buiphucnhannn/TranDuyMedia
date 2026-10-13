"use client";

import { useEffect } from "react";
import { Button, Container } from "@/components/ui";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <h1 className="text-3xl h-display sm:text-4xl">Đã có lỗi xảy ra</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Xin lỗi, đã có sự cố khi tải trang. Vui lòng thử lại.
      </p>
      <div className="mt-10 flex gap-3">
        <Button onClick={() => reset()}>Thử lại</Button>
        <Button href="/" variant="outline">
          Về trang chủ
        </Button>
      </div>
    </Container>
  );
}
