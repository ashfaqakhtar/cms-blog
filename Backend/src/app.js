import express, { urlencoded } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

// Cors 
app.use(cors({
  origin: process.env.BASE_URL,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//to allow json in the url
app.use(express.json())

// to allow space and % symbols in the url
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())



app.get("/", (req, res) => {
  res.send("Blog Management Backend Running ✅");
});






export default app;
