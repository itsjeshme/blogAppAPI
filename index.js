const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//const ROUTES HERE sample: const enrollmentRoutes = require("./routes/enrollment");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");


require("dotenv").config();

const app = express();

app.use(express.json());

const corsOptions = {
	origin: ["http://localhost:8000"],
	credentials: true, 
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."))

//ROUTES HERE sample: app.use("/enrollments", enrollmentRoutes);
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);


if(require.main === module) {

	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}


module.exports = { app, mongoose };