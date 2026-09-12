import UserActivity from "@/models/UserActivity";
import UserStreak from "@/models/UserStreak";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Bumps the user's daily streak. Safe to call on every meaningful action
 * (roadmap generated, stage completed, chat message sent) — it's a no-op
 * if the user was already active today.
 */
export async function bumpStreak(userId: string) {
  const today = todayKey();

  let streak = await UserStreak.findOne({ userId });
  if (!streak) {
    streak = new UserStreak({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
    });
    await streak.save();
    return streak;
  }

  if (streak.lastActiveDate === today) {
    return streak; // already counted today
  }

  const gap = daysBetween(streak.lastActiveDate, today);
  streak.currentStreak = gap === 1 ? streak.currentStreak + 1 : 1;
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastActiveDate = today;
  streak.updatedAt = new Date();
  await streak.save();
  return streak;
}

export async function recordRoadmapActivity(userId: string, roadmapId: string, topic: string) {
  await UserActivity.findOneAndUpdate(
    { userId },
    {
      $set: {
        lastRoadmap: { id: roadmapId, topic, viewedAt: new Date() },
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function recordFeatureViewActivity(
  userId: string,
  type: "video" | "article" | "news",
  url: string,
  title: string
) {
  await UserActivity.findOneAndUpdate(
    { userId },
    {
      $set: {
        lastFeatureView: { type, url, title, viewedAt: new Date() },
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function recordChatActivity(userId: string, sessionId: string, title: string) {
  await UserActivity.findOneAndUpdate(
    { userId },
    {
      $set: {
        lastChatSession: { id: sessionId, title, viewedAt: new Date() },
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}
