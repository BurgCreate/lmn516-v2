"use client";

export default function GardenEntrance() {
  return (
    <section className="garden-entrance">

      <div className="garden-entrance-copy">

        <p className="garden-kicker">
          LMN516 · DIGITAL GARDEN
        </p>

        <h1>
          欢迎来到
          <span>我的数字花园</span>
        </h1>

        <p className="garden-intro">
          一个记录生活、想法、项目与成长轨迹的小空间。
        </p>

        <div className="garden-entrance-actions">

          <a
            href="#top"
            className="garden-enter-button"
          >
            进入花园
          </a>

        </div>

      </div>


      <div className="garden-entrance-visual">

        <div className="garden-illustration-frame">

          <img
            src="/garden-assets/garden-girl.webp"
            alt="garden"
            className="garden-entrance-girl"
          />

        </div>

      </div>


    </section>
  );
}