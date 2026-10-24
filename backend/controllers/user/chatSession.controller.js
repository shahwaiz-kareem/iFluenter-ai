import mongoose from "mongoose";
import ChatSessionModel from "../../models/chatSession.model.js";
import { UAParser } from "ua-parser-js";

class chatSessionController {
  static getChatSessionsData = async (req, res) => {
    try {
      const userId = req.user._id;
      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const day = now.getDay(); // 0 = Sunday
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      const startOfWeek = new Date(now);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      //  Aggregate totals: all sessions
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

      const totalSessions = totals[0]?.totalSessions || 0;
      const totalSpokenMinutes = totals[0]?.totalSpokenMinutes || 0;

      //  Aggregate today's sessions
      const todayAgg = await ChatSessionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfToday },
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
      const todaySessions = todayAgg[0]?.todaySessions || 0;
      const todayMinutes = todayAgg[0]?.todayMinutes || 0;

      //  Aggregate this week's sessions
      const weekAgg = await ChatSessionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startOfWeek },
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
      const weekSessions = weekAgg[0]?.weekSessions || 0;
      const weekMinutes = weekAgg[0]?.weekMinutes || 0;

      //  Calculate streak
      const last7Days = new Date();
      last7Days.setDate(now.getDate() - 6); // last 7 days
      last7Days.setHours(0, 0, 0, 0);

      const recentSessions = await ChatSessionModel.find({
        userId,
        createdAt: { $gte: last7Days },
      }).sort({ createdAt: -1 });

      const uniqueDays = new Set(
        recentSessions.map((s) => s.createdAt.toISOString().slice(0, 10))
      );

      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        if (uniqueDays.has(dateStr)) streak++;
        else break;
      }

      return res.json({
        totalSessions,
        totalSpokenMinutes,
        todaySessions,
        todayMinutes,
        weekSessions,
        weekMinutes,
        streak,
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        error: "something went wrong!",
      });
    }
  };
  static createChatSession = async (req, res) => {
    try {
      const userAgentString = req.headers["user-agent"];

      // Parse the user-agent string
      const parser = new UAParser(userAgentString);
      const ua = parser.getResult();

      const newSession = await ChatSessionModel.create({
        userId: req.user._id,
        ip: req.socket.remoteAddress,
        ua,
      });

      res.status(200).json({ status: "success", data: newSession });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: "something went wrong!",
      });
    }
  };
}

export const { getChatSessionsData, createChatSession } = chatSessionController;
