import type { Metadata } from "next";
import PromotionStudio from "@/components/PromotionStudio";

export const metadata: Metadata = {
  title: "홍보글 자동화 | ULSAN365 Admin Studio",
  description: "ULSAN365 운영용 홍보글 생성 대시보드",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PromotionStudioPage() {
  return <PromotionStudio />;
}
