const router = require("express").Router();
//import
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/user-controller');

// Set up GET all and POST at /api/users
router.route("/").get(getAllUsers).post(createUser);

// Set up GET one, PUT, and DELETE at /api/users/:id
router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);

//Set up PUT and DELETE at /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);
module.exports = router;
