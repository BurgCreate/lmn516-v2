export function getDaypartTitles(hour: number): readonly string[] {
  if (hour >= 5 && hour < 9) {
    return ["🌅 清晨的花园向你问好", "🌱 花园刚刚醒来", "☀️ 晨光替花园送来回信"];
  }
  if (hour >= 9 && hour < 12) {
    return ["🌤️ 上午的花园来信", "🌿 今天也有新的回信", "🪴 日光正好，花园有消息"];
  }
  if (hour >= 12 && hour < 17) {
    return ["🍵 午后收到一封花园来信", "🦋 午后的花园信使到了", "🌼 午后很慢，回信刚好"];
  }
  if (hour >= 17 && hour < 22) {
    return ["🌇 黄昏送来一封新的回信", "🍂 晚风捎来一封信", "🕯️ 天色渐暗，花园亮起回音"];
  }
  if (hour >= 22 || hour < 1) {
    return ["🌙 夜晚的花园来信", "🕯️ 花园里亮起了一盏灯", "✨ 今夜也有一封回信"];
  }
  return ["✨ 夜已经很深了，还有一封回信", "🌙 花园还没有睡", "🌌 深夜的花园轻轻回应你"];
}
