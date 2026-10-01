import type { Metadata } from "next";
import { FileText } from "lucide-react";
import FeatureSearchLayout from "@/component/layout/FeatureSearchLayout";
import FeatureSearch from "@/component/features/FeatureSearch";

export const metadata: Metadata = {
  title: "Expert Articles",
  description:
    "Search in-depth tutorials, guides and expert articles on any topic, and save the best reads to your SkillzUp bookmarks.",
};

export default function ArticlesFeaturePage() {
  return (
    <FeatureSearchLayout
      eyebrow="Expert Articles"
      title="Find articles worth reading"
      description="In-depth tutorials and comprehensive guides on any topic."
      breadcrumb="Articles"
      icon={<FileText className="w-7 h-7" />}
    >
      <FeatureSearch kind="article" />
    </FeatureSearchLayout>
  );
}
