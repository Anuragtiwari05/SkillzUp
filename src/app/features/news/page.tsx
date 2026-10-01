import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import FeatureSearchLayout from "@/component/layout/FeatureSearchLayout";
import FeatureSearch from "@/component/features/FeatureSearch";

export const metadata: Metadata = {
  title: "Latest Tech News",
  description:
    "Stay current with the latest industry news and trends. Search any topic and bookmark the stories you want to come back to.",
};

export default function NewsFeaturePage() {
  return (
    <FeatureSearchLayout
      eyebrow="Latest News"
      title="Stay ahead of the curve"
      description="Search the freshest industry headlines and trends."
      breadcrumb="News"
      icon={<TrendingUp className="w-7 h-7" />}
    >
      <FeatureSearch kind="news" />
    </FeatureSearchLayout>
  );
}
