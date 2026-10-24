import SystemConfigModel from "../models/systemConfig.model.js";
import { cachedData } from "../utils/cache/cacheFromDB.js";

class systemConfigController {
  static getConfigs = async (req, res) => {
    try {
      res
        .status(200)
        .json({ status: "success", config: cachedData.systemConfig });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
        systemConfig: config,
      });
    }
  };
  static updateConfig = async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ status: "failed", message: "fields are required" });
      }
      // const url = "url";
      const newConfig = await SystemConfigModel.updateOne(
        {},
        { $set: req.body }
      );

      cachedData.systemConfig = { ...newConfig };

      return res.status(201).json({
        status: "success",
        message: "config updated successfully!",
        data: newConfig,
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

export const { getConfigs, updateConfig } = systemConfigController;
