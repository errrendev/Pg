const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDB = require('./Database/DB');
const cookieParser = require('cookie-parser');
// const transporter = require('./Config/emailConfig')
const foodRouter = require('./Router/food')
const studentRoutes = require("./Router/student");
const problemRoutes = require("./Router/problem");

app.use("/uploads", express.static("uploads"));

const allowedOrigins = [process.env.ADMIN_URL, process.env.FRONTEND_URL ,process.env.WWW_URL];

connectToDB();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ✅ Allow credentials (important)
  methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow required methods
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
}));

// app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// Define a simple route
app.get('/api', (req, res) => {
  res.send('Hello, World!');
});

app.use("/students", studentRoutes);
app.use("/api/foodplan", foodRouter);
app.use("/problems", problemRoutes);



module.exports = app;