import app from "./app";
import { envVariables } from "./config/env";

if (process.env.NODE_ENV !== 'production') {
  app.listen(envVariables.PORT, () => {
    console.log(`Server running on http://localhost:${envVariables.PORT}`);
  });
}

export default app;