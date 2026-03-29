import express, { Application, Request, Response } from "express"
import { IndexRoutes } from "./app/routes"
import cors from "cors";
import { envVariables } from "./config/env";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";

const app: Application = express()

app.use(cors({
    origin: [envVariables.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.post("/webhook", express.raw({ type: "application/json" }), async (req:Request, res: Response) => {
  console.log("webhook", req.body);
  res.status(200).json({received: true})
})


app.use('/api/auth', toNodeHandler(auth))



app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/app/templates'));


app.use("/api/v1", IndexRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Boat server is running')
})


export default app;