import mongoose from "mongoose";
import MessageModel from "../../models/message.model.js";
import ChatSessionModel from "../../models/chatSession.model.js";
import {
  startOfDay,
  startOfWeek,
  subWeeks,
  endOfWeek,
  format,
  eachDayOfInterval,
  subDays,
  isSameDay,
} from "date-fns";

class progressController {
  static aggregateProgress = async (userId, gteDate, lteDate) => {
    const progressAgg = await MessageModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: gteDate,
            $lte: lteDate,
          },
          userSpeechDuration: { $gte: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgWpm: { $avg: "$wpm" },
          avgFluencyScore: { $avg: "$fluencyScore" },
          totalSpeechDuration: { $sum: "$userSpeechDuration" },
          fillerCount: { $sum: "$fillerCount" },
          grammaticalMistakesCount: { $sum: "$grammaticalMistakesCount" },
        },
      },
    ]);

    const data = progressAgg[0] || {};
    return {
      avgWpm: data.avgWpm || 0,
      avgFluencyScore: data.avgFluencyScore || 0,
      totalSpeechDuration: data.totalSpeechDuration || 0,
      fillerCount: data.fillerCount || 0,
      grammaticalMistakesCount: data.grammaticalMistakesCount || 0,
    };
  };

  /**
   * Gets fluency scores for each day of the current week
   */
  static getFluencyScores = async (userId) => {
    const now = new Date();
    // Start of current week (Monday)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });

    const progressAgg = await MessageModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: weekStart },
          userSpeechDuration: { $gte: 0 },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          fluencyScore: { $avg: "$fluencyScore" },
        },
      },
    ]);

    // Map Mongo $dayOfWeek (1=Sun, 7=Sat) to labels
    const daysMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
    };

    // Create a fixed array for Mon -> Sun to ensure consistent UI display
    const fluencyData = [2, 3, 4, 5, 6, 7, 1].map((dayNum) => {
      const found = progressAgg.find((item) => item._id === dayNum);
      return {
        day: daysMap[dayNum],
        fluencyScore: found ? parseFloat(found.fluencyScore.toFixed(1)) : null,
      };
    });

    return fluencyData;
  };

  /**
   * Gets session counts, minutes, and current daily streak
   */
  static getChatSessionsData = async (userId) => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });

    // 1. Total Stats
    const totals = await ChatSessionModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalSpokenMinutes: { $sum: "$spokenDuration" },
        },
      },
    ]);

    // 2. Today Stats
    const todayAgg = await ChatSessionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: todayStart },
        },
      },
      {
        $group: {
          _id: null,
          todaySessions: { $sum: 1 },
          todayMinutes: { $sum: "$spokenDuration" },
        },
      },
    ]);

    // 3. This Week Stats
    const weekAgg = await ChatSessionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: null,
          weekSessions: { $sum: 1 },
          weekMinutes: { $sum: "$spokenDuration" },
        },
      },
    ]);

    // 4. Calculate Streak
    const last14Days = subDays(todayStart, 14); // Fetch enough data for streak calc
    const sessions = await ChatSessionModel.find({
      userId,
      createdAt: { $gte: last14Days },
    }).sort({ createdAt: -1 });

    const uniqueDays = sessions.map((s) => format(s.createdAt, "yyyy-MM-dd"));
    const daySet = new Set(uniqueDays);

    let streak = 0;
    let checkDate = todayStart;

    // Check backwards from today
    for (let i = 0; i < 14; i++) {
      const dateStr = format(subDays(todayStart, i), "yyyy-MM-dd");
      if (daySet.has(dateStr)) {
        streak++;
      } else {
        // If they haven't practiced today, don't break yet, check yesterday
        if (i === 0) continue;
        break;
      }
    }

    return {
      totalSessions: totals[0]?.totalSessions || 0,
      totalSpokenMinutes: totals[0]?.totalSpokenMinutes || 0,
      todaySessions: todayAgg[0]?.todaySessions || 0,
      todayMinutes: todayAgg[0]?.todayMinutes || 0,
      weekSessions: weekAgg[0]?.weekSessions || 0,
      weekMinutes: weekAgg[0]?.weekMinutes || 0,
      streak,
    };
  };

  static getProgress = async (req, res) => {
    try {
      const userId = req.user._id;
      const now = new Date();

      // Define clear, immutable boundaries
      const startOfToday = startOfDay(now);
      const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });

      const startOfLastWeek = startOfWeek(subWeeks(now, 1), {
        weekStartsOn: 1,
      });
      const endOfLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

      // Execute aggregations with specific intervals
      const todayData = await this.aggregateProgress(userId, startOfToday, now);
      const thisWeekData = await this.aggregateProgress(
        userId,
        startOfThisWeek,
        now
      );
      const lastWeekData = await this.aggregateProgress(
        userId,
        startOfLastWeek,
        endOfLastWeek
      );

      const fluencyScoreData = await this.getFluencyScores(userId);
      const chatSessionData = await this.getChatSessionsData(userId);

      return res.status(200).json({
        todayData,
        thisWeekData,
        lastWeekData,
        fluencyScoreData,
        chatSessionData,
        status: "success",
      });
    } catch (error) {
      console.error("Progress Error:", error);
      return res.status(500).json({
        status: "failed",
        error: "Something went wrong while fetching progress data.",
      });
    }
  };
}

export const getProgress = progressController.getProgress;
export const getFluencyScores = progressController.getFluencyScores;
