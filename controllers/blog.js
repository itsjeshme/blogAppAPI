const Blog = require('../models/Blog');
const auth = require("../auth");


module.exports.createBlog = (req, res) => {

    let newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.user.id
    });

    return newBlog.save()
        .then(result => res.status(201).send(result))
        .catch(error => res.status(500).send(error));
};


module.exports.getAllBlogs = (req, res) => {

    return Blog.find({})
        .populate("author", "username email")
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error));
};


module.exports.getBlog = (req, res) => {

    return Blog.findById(req.params.blogId)
        .populate("author", "username email")
        .then(result => {

            if (!result) {
                return res.status(404).send({
                    message: "Blog not found"
                });
            }

            return res.status(200).send(result);
        })
        .catch(error => res.status(500).send(error));
};


module.exports.updateBlog = async (req, res) => {

    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
        return res.status(404).send({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
        return res.status(403).send({
            message: "Not allowed to update this blog"
        });
    }

    blog.title = req.body.title;
    blog.content = req.body.content;

    return blog.save()
        .then(updated => res.status(200).send(updated))
        .catch(error => res.status(500).send(error));
};


module.exports.deleteBlog = async (req, res) => {

    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
        return res.status(404).send({ message: "Blog not found" });
    }

    if ( blog.author.toString() !== req.user.id && req.user.isAdmin !== true) {
        return res.status(403).send({
            message: "Not allowed to delete this blog"
        });
    }

    return blog.deleteOne()
        .then(() => res.status(200).send({
            message: "Blog deleted successfully"
        }))
        .catch(error => res.status(500).send(error));
};