const express = require("express");
const app = express();
const port = 8080;

const authMiddleware = require("./middlewares/auth");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRouter = require("./routes/users");

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/movies", authMiddleware, (req, res) => {
  return res.json({
    message: `Listing movies for userId: ${req.userId}`,
  });
});

// Close the database connection when the app is terminated
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    }
    console.log("Closed the database connection.");
    process.exit(0);
  });
});
