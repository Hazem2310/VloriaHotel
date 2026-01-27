import express from "express";
import cors from "cors";
const DatabaseSingleton = require("./dbSingleton");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

//from api
const uploadRouter = require("./routes/upload");
app.use("/api/upload", uploadRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
