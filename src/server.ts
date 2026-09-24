// import app from "./app";
import app from "./app";
import config from "./config";
import { connectDB } from "./lib/db";

const main = async () => {
      try {
            await connectDB();
            app.listen(config.port, () => {
                  console.log(`Server is listening on port ${config.port}`);
            });
      } catch (error) {
            console.log(error);
      }
}

main();