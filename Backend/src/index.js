import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/dbConnection.js";


// imoprt all routes
import userRoutes from './routes/user.route.js'


dotenv.config({
  path: "./.env",
});




const PORT = process.env.PORT || 5000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
  });



  // User Routes

app.use("/api/v1/users", userRoutes)
