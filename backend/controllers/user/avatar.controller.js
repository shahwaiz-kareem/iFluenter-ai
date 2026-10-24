import AvatarModel from "../../models/avatar.model.js";

class avatarController {
  static getAllAvatars = async (req, res) => {
    try {
      const avatars = await AvatarModel.find();
      res.status(200).json({ status: "success", avatars });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };
  static createAvatar = async (req, res) => {
    try {
      const { name, gender, profile, actModes } = req.body;
      if (!name || !gender || !profile || !actModes) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }
      const url = "url";
      const newAvatar = await AvatarModel.create({
        name,
        gender,
        profile,
        actModes,
        url,
      });

      return res.status(201).json({
        status: "success",
        message: "New avatar created successfully!",
        data: newAvatar,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };

  static deleteAvatar = async (req, res) => {
    //Todo: Change the avatar of all users who are using the deleted avatar, to existing one to avoid errors.
    try {
      const { _id: avatarId } = req.body;

      if (!avatarId) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      await AvatarModel.findByIdAndDelete(avatarId);

      return res.status(200).json({
        status: "success",
        message: "avatar has been deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };
}

export const { getAllAvatars, createAvatar, deleteAvatar } = avatarController;
