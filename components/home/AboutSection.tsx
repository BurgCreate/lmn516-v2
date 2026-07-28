export default function AboutSection() {
  return (
    <section id="about" className="about shell section-space">
      <p className="eyebrow">关于本站</p>

      <div className="about-grid">
        <h2>
          一个人的网站，
          <br />
          应该像他的房间。
        </h2>

        <div>
          <p>
            不必每件东西都有用，
            也不必每篇文章都得出结论。
            这里保存一些生活留下的痕迹，
            让时间不至于全部悄无声息地消失。
          </p>

          <p>
            LMN516 建立于 2025 年，
            持续更新于深圳。
          </p>

          <div className="about-links">
            <a href="mailto:hello@lmn516.com">写信</a>
            <a href="https://lmn516.com/feed/">RSS</a>
          </div>
        </div>
      </div>
    </section>
  );
}
