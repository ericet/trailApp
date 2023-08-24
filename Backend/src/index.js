const express = require("express");
const app = express();
const port = 5000;
const trailRouter = require("./routes/trail");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userInfo");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/", trailRouter);

app.use('/', authRouter);

app.use('/',userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Connected to database, app listenning on port ${port}`)
});
