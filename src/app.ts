import express from "express";
import routes from "./routes";
import config from "./config";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin:config.frontend_url as string,
    credentials: true
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message:
      "AI Political Poster Maker API is running"
  });
});

app.use("/api", routes);

app.use(
  (
    _req,
    res
  ) => {
    res.status(404).json({
      success: false,
      message: "Route not found"
    });
  }
);

export default app;