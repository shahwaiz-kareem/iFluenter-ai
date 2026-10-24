import envModel from "../../models/env.model.js";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import EnvModel from "../../models/env.model.js";
import {
  getExtensionFromBase64,
  purifyBase64,
} from "../../utils/admin/utils.js";
import mongoose from "mongoose";

class adminEnvController {
  // Admin controllers
  static getEnvs = async (req, res) => {
    const envs = await envModel.find();
    try {
      res.status(200).json({
        envs,
        status: "success",
        message: "env is fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch env.",
      });
    }
  };
  static upsertEnv = async (req, res) => {
    try {
      let modelUrl = "";
      let previewImage = "";
      const { envId, ...updateData } = req.body;
      const isNew = !envId || envId === "new";

      if (isNew) {
        const envFolderName = req.body.name.trim().replace(/\s+/g, "_");
        const imgExtension = await getExtensionFromBase64(req.body.preview);

        const relativeFolder = `envs/${envFolderName}`;
        const uploadRootDir = path.join(process.cwd(), "uploads");
        const targetDir = path.join(uploadRootDir, relativeFolder);

        await mkdir(targetDir, { recursive: true });

        const fullModelPath = path.join(targetDir, "env.hdr");
        const fullImagePath = path.join(targetDir, `preview.${imgExtension}`);

        await writeFile(fullModelPath, purifyBase64(req.body.url));

        await writeFile(fullImagePath, purifyBase64(req.body.preview));

        modelUrl = `${process.env.BACKEND_HOST}/assets/${relativeFolder}/env.hdr`;
        previewImage = `${process.env.BACKEND_HOST}/assets/${relativeFolder}/preview.${imgExtension}`;
      } else {
        modelUrl = req.body.url;
        previewImage = req.body.preview;
      }
      console.log(req.body.envId);

      const env = await EnvModel.findByIdAndUpdate(
        isNew ? new mongoose.Types.ObjectId() : envId,
        {
          ...updateData,
          url: modelUrl,
          preview: previewImage,
        },
        {
          new: true,
          upsert: true,
        }
      );

      res.status(200).json({
        env,
        status: "success",
        message: "env upserted successfully!",
      });
    } catch (error) {
      console.error("Upsert Error:", error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to upsert env.",
        error: error.message,
      });
    }
  };
}

export default adminEnvController;
