import type { Metadata } from "next";
import { Youtube } from "lucide-react";
import FeatureSearchLayout from "@/component/layout/FeatureSearchLayout";
import FeatureSearch from "@/component/features/FeatureSearch";

export const metadata: Metadata = {
  title: "YouTube Learning Videos",
  description:
    "Search any topic and discover top YouTube tutorials and channels from the best educators, then bookmark the ones worth watching.",
};

export default function YTFeaturePage() {
  return (
    <FeatureSearchLayout
      eyebrow="YouTube Channels"
      title="Search YouTube learning videos"
      description="Enter any topic and discover top tutorials instantly."
      breadcrumb="YouTube Picks"
      icon={<Youtube className="w-7 h-7" />}
    >
      <FeatureSearch kind="yt" />
    </FeatureSearchLayout>
  );
}
