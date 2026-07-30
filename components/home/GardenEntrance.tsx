import Image from "next/image";
import Link from "next/link";

export default function GardenEntrance() {
  return (
    <section className="garden-entrance shell" aria-labelledby="garden-title">
      <div className="garden-entrance-copy">
        <p className="garden-kicker">
          <span aria-hidden="true">✦</span>
          LMN516 · A LIVING DIGITAL GARDEN
        </p>

        <h1 id="garden-title">
          欢迎来到
          <span>一座正在生长的花园</span>
        </h1>

        <p className="garden-intro">
          这里收藏文字、照片、音乐和一些缓慢发生的生活。
          <br />
          没有算法催促你，只需要沿着小路慢慢往前走。
        </p>

        <div className="garden-entrance-actions">
          <a className="garden-enter-button" href="#garden-today">
            <span>进入花园</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M14 7l5 5-5 5" />
            </svg>
          </a>

          <Link className="garden-note-link" href="/about">
            认识花园主人
          </Link>
        </div>

        <div className="garden-visitor-note" aria-label="花园共建说明">
          <span className="garden-visitor-flower" aria-hidden="true">✿</span>
          <p>
            这座花园由我记录，也由每一位来访者共同留下痕迹。
          </p>
        </div>
      </div>

      <div className="garden-entrance-visual" aria-label="花园管理员插画">
        <span className="garden-sun" aria-hidden="true" />
        <span className="garden-cloud garden-cloud-one" aria-hidden="true" />
        <span className="garden-cloud garden-cloud-two" aria-hidden="true" />

        <div className="garden-illustration-frame">
          <Image
            src="/images/garden/garden-girl.jpeg"
            alt="戴草帽的女孩正在花园里照看一朵小雏菊"
            fill
            priority
            sizes="(max-width: 760px) 88vw, 46vw"
            className="garden-girl-image"
          />
        </div>

        <div className="garden-sign" aria-hidden="true">
          <span>LMN516</span>
          <small>慢慢生长中</small>
        </div>

        <svg className="garden-line-art" viewBox="0 0 620 190" aria-hidden="true">
          <path d="M8 154c66-18 111-12 168 2 57 14 104 19 166 3 69-18 142-29 269-4" />
          <path d="M48 158c2-18 7-34 17-48M60 157c10-18 21-31 37-43M530 158c-1-23-8-42-20-57M545 158c9-21 20-36 36-49" />
          <path d="M157 160c0-15 4-29 11-40M173 161c8-16 17-28 29-36M430 160c2-18 8-32 18-45M447 160c10-14 22-25 36-31" />
        </svg>
      </div>

      <a className="garden-scroll-cue" href="#garden-today" aria-label="继续向下浏览">
        <span>继续散步</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v15M7 14l5 5 5-5" />
        </svg>
      </a>
    </section>
  );
}
