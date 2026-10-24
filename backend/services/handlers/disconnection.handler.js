import ChatSessionModel from "../../models/chatSession.model.js";

export const disconnectionHandler = async (socket) => {
  try {
    if (!socket?.currentSession?._id) return;
    await ChatSessionModel.findByIdAndUpdate(socket?.currentSession?._id, {
      $set: {
        endedAt: new Date(),
        chatMode: socket.chatMode,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
