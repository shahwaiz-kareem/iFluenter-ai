import AvatarModel from "../../models/avatar.model.js";
import {
  getExtensionFromBase64,
  purifyBase64,
} from "../../utils/admin/utils.js";
import path from "path";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import mongoose from "mongoose";

class adminAvatarController {
  // Admin controllers
  static getAvatars = async (req, res) => {
    const avatars = await AvatarModel.find();
    try {
      res.status(200).json({
        avatars,
        status: "success",
        message: "avatar is fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch avatar.",
      });
    }
  };
  static upsertAvatar = async (req, res) => {
    try {
      let modelUrl = "";
      let previewImage = "";
      const { avatarId, ...updateData } = req.body;
      const isNew = !avatarId || avatarId === "new";

      if (isNew) {
        const avatarFolderName = req.body.name.trim().replace(/\s+/g, "_");
        const imgExtension = await getExtensionFromBase64(req.body.preview);

        const relativeFolder = `avatars/${avatarFolderName}`;
        const uploadRootDir = path.join(process.cwd(), "uploads");
        const targetDir = path.join(uploadRootDir, relativeFolder);

        await mkdir(targetDir, { recursive: true });

        const fullModelPath = path.join(targetDir, "avatar.glb");
        const fullImagePath = path.join(targetDir, `preview.${imgExtension}`);

        await writeFile(fullModelPath, purifyBase64(req.body.url));

        await writeFile(fullImagePath, purifyBase64(req.body.preview));

        modelUrl = `${process.env.BACKEND_HOST}/assets/${relativeFolder}/avatar.glb`;
        previewImage = `${process.env.BACKEND_HOST}/assets/${relativeFolder}/preview.${imgExtension}`;
      } else {
        modelUrl = req.body.url;
        previewImage = req.body.preview;
      }
      console.log(req.body.avatarId);

      const avatar = await AvatarModel.findByIdAndUpdate(
        isNew ? new mongoose.Types.ObjectId() : avatarId,
        {
          ...updateData,
          url: modelUrl,
          preview: previewImage,
        },
        {
          new: true,
          upsert: true,
          // setDefaultsOnInsert: true,
          // runValidators: true,
        }
      );

      res.status(200).json({
        avatar,
        status: "success",
        message: "Avatar upserted successfully!",
      });
    } catch (error) {
      console.error("Upsert Error:", error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to upsert avatar.",
        error: error.message,
      });
    }
  };
}

export default adminAvatarController;
