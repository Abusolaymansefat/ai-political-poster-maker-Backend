import { Db, MongoClient } from "mongodb";
import config from "../config";

let client: MongoClient | undefined;
let database: Db | undefined;

export const connectDB = async () => {
  client = new MongoClient(config.database_url);
  await client.connect();
  database = client.db();
  await database.command({ ping: 1 });

  const templates = database.collection("templates");
  const defaults = [
    {
      title: "Victory Day",
      occasionType: "victory-day",
      thumbnailUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80",
      backgroundUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80"
    },
    {
      title: "Condolence",
      occasionType: "condolence",
      thumbnailUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80",
      backgroundUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=80"
    },
    {
      title: "Campaign",
      occasionType: "campaign",
      thumbnailUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
      backgroundUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80"
    },
    {
      title: "Greeting",
      occasionType: "greeting",
      thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&q=80",
      backgroundUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&q=80"
    },
    {
      title: "Eid",
      occasionType: "eid",
      thumbnailUrl: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=900&q=80",
      backgroundUrl: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=1600&q=80"
    }
  ];

  await Promise.all(
    defaults.map((template) =>
      templates.updateOne(
        { occasionType: template.occasionType },
        {
          $setOnInsert: {
            ...template,
            layoutConfig: {},
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        { upsert: true }
      )
    )
  );

  console.log("MongoDB connected successfully");
};

export const getDb = () => {
  if (!database) {
    throw new Error("MongoDB has not been connected");
  }

  return database;
};