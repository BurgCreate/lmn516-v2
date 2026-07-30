import Link from "next/link";
import { GardenPageHero } from "@/components/garden";

export default function NotFound() {
  return (
    <main className="shell garden-subpage garden-lost-page">
      <GardenPageHero
        scene="lost"
        place="迷路的小径"
        eyebrow="404 · Path Not Found"
        title="这条路暂时没有开放"
        intro="你可能走进了一条还没有长出来的小路。没关系，花园女孩已经带着地图来找你了。"
      />

      <div className="garden-lost-actions">
        <Link href="/" className="button-link">
          返回花园入口
        </Link>
        <Link href="/archive" className="text-link">
          去阅读树下看看 →
        </Link>
      </div>
    </main>
  );
}
