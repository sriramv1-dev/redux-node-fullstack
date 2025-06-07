const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/paginated", userController.getAllUsersWithPagination);
router.post("/", userController.addUser);
router.patch("/:id", userController.updateUser);
router.post("/add-multiple", userController.addBulkUsers);

module.exports = router;
