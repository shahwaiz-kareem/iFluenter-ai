import BackgroundModel from "../../models/background.model.js";

class backgroundController {
  static getBackgrounds = async (req, res) => {
    try {
      const backgrounds = await BackgroundModel.find();
      res.status(200).json({ status: "success", backgrounds });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };

  static createBackground = async (req, res) => {
    try {
      const { name, actModes } = req.body;

      if (!name || !actModes) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }
      const url = "url";
      const newBackground = await BackgroundModel.create({
        name,
        actModes,
        url,
      });

      return res.status(201).json({
        status: "success",
        message: "New background created successfully!",
        data: newBackground,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "something went wrong, please try again later!",
      });
    }
  };

  static deleteBackground = async (req, res) => {
    //Todo: Change the background of all users who are using the deleted background, to existing one to avoid errors.
    try {
      const { _id: backgroundId } = req.body;

      if (!backgroundId) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      await BackgroundModel.findByIdAndDelete(backgroundId);

      return res.status(200).json({
        status: "success",
        message: "background has been deleted successfully!",
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

export const { getBackgrounds, createBackground, deleteBackground } =
  backgroundController;
