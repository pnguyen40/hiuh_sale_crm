import { createFileRoute } from "@tanstack/react-router";
import CrmPrototype from "@/components/crm/CrmPrototype";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sale CRM · Operation Portal | HIUH · HBH" },
      { name: "description", content: "Prototype Sale CRM: giám sát hồ sơ tư vấn, danh bạ Contact và cơ hội khám đoàn doanh nghiệp của HIUH · HBH." },
      { property: "og:title", content: "Sale CRM · Operation Portal | HIUH · HBH" },
      { property: "og:description", content: "Giám sát khách lẻ, quản lý cơ hội doanh nghiệp và thử nghiệm quy trình tư vấn với dữ liệu giả lập." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CrmPrototype persona="SALES-HEAD" scaleMode="fluid" />;
}
