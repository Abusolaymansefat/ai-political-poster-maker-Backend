import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "path";

dotenvExpand.expand(
      dotenv.config({
            path: path.join(process.cwd(), ".env"),
            override: true
      })
);

export default {
      port: process.env.PORT,
      database_url: process.env.MONGO_DB_URL!,
      jwt_secret: process.env.JWT_SECRET!,
      jwt_expires_in: process.env.JWT_EXPIRES_IN!,
      cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
      cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
      gemini_api_key: process.env.GEMINI_API_KEY!,
      frontend_url: process.env.FRONTEND_URL!,
}
