import UserModel from "../../models/user.model.js";
import ChatSessionModel from "../../models/chatSession.model.js";

class statsController {
  static getStats = async (req, res) => {
    try {
      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      //User stats
      const [
        totalUsers,
        verifiedUsers,
        onboardedUsers,
        suspendedUsers,
        freeUsers,
        proUsers,
        expiredUsers,
        unpaidUsers,
        pausedUsers,
        cancelledUsers,
        newUsersToday,
        newUsersLast7Days,
      ] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ isVerified: true }),
        UserModel.countDocuments({ isOnboarded: true }),
        UserModel.countDocuments({ isSuspended: true }),
        UserModel.countDocuments({ subscriptionStatus: "free" }),
        UserModel.countDocuments({ subscriptionStatus: "active" }),
        UserModel.countDocuments({ subscriptionStatus: "expired" }),
        UserModel.countDocuments({ subscriptionStatus: "unpaid" }),
        UserModel.countDocuments({ subscriptionStatus: "paused" }),
        UserModel.countDocuments({ subscriptionStatus: "cancelled" }),
        UserModel.countDocuments({ createdAt: { $gte: startOfToday } }),
        UserModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      ]);

      // CHAT SESSION STATS

      const [
        totalSessions,
        sessionsToday,
        activeUsersLast7Days,
        sessionAggregates,
      ] = await Promise.all([
        ChatSessionModel.countDocuments(),
        ChatSessionModel.countDocuments({ createdAt: { $gte: startOfToday } }),
        ChatSessionModel.distinct("userId", {
          createdAt: { $gte: sevenDaysAgo },
        }),
        ChatSessionModel.aggregate([
          {
            $group: {
              _id: null,
              totalSpokenDuration: { $sum: "$spokenDuration" },
              totalMessages: { $sum: "$messages" },
              avgSpokenDuration: { $avg: "$spokenDuration" },
              avgMessages: { $avg: "$messages" },
            },
          },
        ]),
      ]);

      const engagement =
        sessionAggregates.length > 0 ? sessionAggregates[0] : {};

      //Distribution stats

      const [signupSourceStats, visitSourceStats, proficiencyStats] =
        await Promise.all([
          UserModel.aggregate([
            { $group: { _id: "$signupSource", count: { $sum: 1 } } },
          ]),
          UserModel.aggregate([
            { $group: { _id: "$visitSource", count: { $sum: 1 } } },
          ]),
          UserModel.aggregate([
            { $group: { _id: "$proficiencyLevel", count: { $sum: 1 } } },
          ]),
        ]);

      return res.status(200).json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            verified: verifiedUsers,
            onboarded: onboardedUsers,
            suspended: suspendedUsers,
            free: freeUsers,
            pro: proUsers,
            expired: expiredUsers,
            unpaid: unpaidUsers,
            paused: pausedUsers,
            cancelled: cancelledUsers,
            newToday: newUsersToday,
            newLast7Days: newUsersLast7Days,
          },
          sessions: {
            total: totalSessions,
            today: sessionsToday,
            activeUsersLast7Days: activeUsersLast7Days.length,
            totalSpokenDuration: engagement.totalSpokenDuration || 0,
            avgSpokenDuration: Math.round(engagement.avgSpokenDuration || 0),
            avgMessages: Math.round(engagement.avgMessages || 0),
          },
          distributions: {
            signupSource: signupSourceStats,
            visitSource: visitSourceStats,
            proficiencyLevel: proficiencyStats,
          },
        },
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin stats",
      });
    }
  };
}
export default statsController;
