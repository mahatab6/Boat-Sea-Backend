import app from "./app";
import { envVariables } from "./config/env";


const serverStart = async () => {
  try {
     app.listen(envVariables.PORT, () => {
      console.log(`Server is running on http://localhost:${envVariables.PORT}`);
    });
  } catch (error) {
    console.error("server failed to start server", error);
  }
};

serverStart()