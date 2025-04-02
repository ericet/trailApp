const express = require("express");
const app = express();
const port = 5000;
const trailRouter = require("./routes/trail");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userInfo");
const cors = require('cors');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8080', // Vue.js dev server
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/", trailRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Connected to database, app listening on port ${port}`)
});
