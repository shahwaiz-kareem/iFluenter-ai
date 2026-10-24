import UserModel from "../../models/user.model.js";

class adminUserController {
  // Admin controllers
  static getUser = async (req, res) => {
    const { userId } = req?.query;
    if (!userId)
      return res.status(400).json({
        status: "failed",
        message: "user id is required",
      });

    const user = await UserModel.findById(userId).select("-password");

    try {
      res.status(200).json({
        user,
        status: "success",
        message: "User is fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch user.",
      });
    }
  };
  static getUsers = async (req, res) => {
    try {
      const { pageNo, pageLimit, sortBy } = req?.query;
      if (!pageLimit || !pageNo)
        return res.status(400).json({
          status: "failed",
          message: "All queries are required",
        });

      const users = await UserModel.find()
        .select("-password")
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit)
        .sort(sortBy.toString())
        .exec();

      res.status(200).json({
        users,
        status: "success",
        message: "Users are fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch users.",
      });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ status: "failed", message: "userId not provided!" });
      }

      const user = await UserModel.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");

      delete user.password;

      if (!user) {
        return res
          .status(400)
          .json({ status: "failed", message: "user not found" });
      }

      // const updatedUser = await user.save(req.body);

      res.status(201).json({
        status: "success",
        message: "User has been updated successfully!",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "User was is not updated!",
      });
    }
  };

  static searchUser = async (req, res) => {
    try {
      let { searchKey, searchValue, pageLimit, pageNo } = req.query;

      if (!searchKey || !searchValue || !pageLimit || !pageNo)
        return res.status(400).json({
          status: "failed",
          message: "All queries are required",
        });

      if (searchValue.toString().trim() === "true") searchValue = true;
      if (searchValue.toString().trim() === "false") searchValue = false;
      const searchResult = await UserModel.find({
        [searchKey.toString()]: searchValue.toString(),
      })
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit)
        .exec();

      if (!searchResult) {
        return res.status(400).json({
          status: "failed",
          message: "No user found with this filter!",
        });
      }

      res.status(201).json({
        status: "success",
        message: "Search query successful",
        searchResult,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "search query failed!",
      });
    }
  };
}

export default adminUserController;
