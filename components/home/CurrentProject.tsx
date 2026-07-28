import Link from "next/link";
import type { Post } from "@/lib/wordpress";

type CurrentProjectProps = {
  pushupPost: Post | null;
  pushups: number;
  target: number;
  pushupProgress: string;
  remaining: number;
};

export default function CurrentProject({
  pushupPost,
  pushups,
  target,
  pushupProgress,
  remaining,
}: CurrentProjectProps) {
  return (
    <section id="project" className="project shell section-space">
      <div className="project-copy">
        <p className="eyebrow">持续进行</p>
        <h2>一万个俯卧撑</h2>

        <p>
          开始于 2026 年 2 月 16 日。
          没有宏大的宣言，
          只有一天一天如实记录。
        </p>

        {pushupPost && (
          <Link className="text-link" href={`/posts/${pushupPost.slug}`}>
            阅读专题记录 →
          </Link>
        )}
      </div>

      <div className="progress-panel">
        <div className="progress-number">
          <strong>{pushups.toLocaleString("zh-CN")}</strong>
          <span>/ {target.toLocaleString("zh-CN")}</span>
        </div>

        <div className="progress-track">
          <span style={{ width: `${pushupProgress}%` }} />
        </div>

        <div className="progress-meta">
          <span>已完成 {pushupProgress}%</span>
          <span>剩余 {remaining.toLocaleString("zh-CN")} 个</span>
        </div>
      </div>
    </section>
  );
}
