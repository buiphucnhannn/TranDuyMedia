import { ProductBrowser } from "@/components/gallery";
import { Container } from "@/components/ui";
import { PageHeader } from "@/components/sections";
import { getProducts } from "@/lib/products";
import { createMetadata } from "@/lib/metadata";

// Nền đầu trang: 6 cột ảnh trôi lên/xuống so le, lấy vòng từ ảnh của các sản phẩm
const headerColumns = (products) => {
  const pool = products.flatMap((p) =>
    p.images.filter((m) => m.type === "image").map((m) => m.src),
  );
  if (!pool.length) pool.push("/images/bts/bts-05.webp");
  return Array.from({ length: 6 }, (_, i) =>
    [0, 1, 2].map((k) => pool[(i * 5 + k * 2) % pool.length]),
  );
};

export const metadata = createMetadata({
  title: "Sản phẩm đã thực hiện",
  description:
    "Các dự án hình ảnh và video do Tran Duy Media Studio thực hiện: concept, lookbook, lifestyle, mùa lễ — từ ý tưởng, dựng bối cảnh, ánh sáng đến hậu kỳ.",
  path: "/san-pham",
  image: "/images/vintage-green/vintage-green-03.webp",
});

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader
        title="Sản phẩm"
        eyebrow="Dự án đã thực hiện"
        description="Những dự án hình ảnh và video do Tran Duy Media thực hiện — từ ý tưởng, dựng bối cảnh đến hậu kỳ."
        columns={headerColumns(products)}
      />

      <section
        className="bg-paper pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24"
        data-nav-theme="light"
      >
        <Container>
          <ProductBrowser products={products} />
        </Container>
      </section>
    </>
  );
}
