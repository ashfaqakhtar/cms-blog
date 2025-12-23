// import express, { urlencoded } from "express";
// import cors from 'cors';
// import cookieParser from "cookie-parser";

// const app = express();

// // Cors 
// app.use(cors({
//   origin: process.env.BASE_URL,
//   methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// //to allow json in the url
// app.use(express.json())

// // to allow space and % symbols in the url
// app.use(express.urlencoded({ extended: true }))

// app.use(cookieParser())



// app.get("/", (req, res) => {
//   res.send("Blog Management Backend Running ✅");
// });






// export default app;


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import commentRoutes from "./routes/comment.route.js";
import categoryRoutes from "./routes/category.routes.js";
import likeRoutes from "./routes/like.route.js";

const app = express();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.send("Blog Management Backend Running ✅");
});

// 🔥 API ROUTES (VERY IMPORTANT)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/likes", likeRoutes);

export default app;
