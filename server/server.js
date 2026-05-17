require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.json({
        message: "Hello from Backend 🚀"
    });
});
const PORT = 5000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});