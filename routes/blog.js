const express = require('express');
const blogController = require('../controllers/blog');
const { verify } = require("../auth");

const router = express.Router();

router.post("/", verify, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:blogId", blogController.getBlog);
router.put("/:blogId", verify, blogController.updateBlog);
router.delete("/:blogId", verify, blogController.deleteBlog);

module.exports = router;