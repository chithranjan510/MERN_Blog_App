import userModel from "../models/user.model.js";

export const GetAuthorDetail = async (req, res) => {
  try {
    const result = await userModel.aggregate([
      {
        $match: {
          isAdmin: { $ne: true },
        },
      },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "userId",
          as: "posts",
        },
      },
      {
        $addFields: {
          postCount: { $size: "$posts" },
        },
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          users: {
            $push: {
              userId: "$_id",
              username: "$username",
              profileImagePath: "$profileImagePath",
              email: "$email",
              postCount: "$postCount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          users: 1,
        },
      },
    ]);

    res.status(200).json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
