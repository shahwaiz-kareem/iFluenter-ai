import AvatarModel from "../../models/avatar.model.js";
import EnvModel from "../../models/env.model.js";
import SystemConfigModel from "../../models/systemConfig.model.js";

export let cachedData = {
  avatars: [],
  envs: [],
  systemConfig: null,
};

let areRefreshing = {
  assets: false,
  systemConfig: false,
};

export const refreshData = async (dataType, timeout) => {
  // console.log(dataType, timeout);
  if (areRefreshing[dataType]) return;
  areRefreshing[dataType] = true;

  try {
    if (dataType === "systemConfig") {
      let config = await SystemConfigModel.findOne({});
      if (!config) config = await SystemConfigModel.create({});
      if (
        !cachedData.systemConfig ||
        config.updatedAt > cachedData.systemConfig.updatedAt
      ) {
        cachedData.systemConfig = config;
      }
    }
    if (dataType === "assets") {
      const avatars = await AvatarModel.find();
      const envs = await EnvModel.find();
      cachedData.avatars = avatars;
      cachedData.envs = envs;
    }
  } catch (error) {
    console.log("Refreshing error for " + dataType + " ", error.message);
  } finally {
    areRefreshing[dataType] = false;
    setTimeout(() => refreshData(dataType, timeout), timeout);
  }
};
