import express, { Express } from "express";
import {
  create,
  deleteOne,
  findAll,
  findOne,
  updateOneTable,
} from "./src/controllers/TableController";
import dotenv from "dotenv";
import {
  getAllUsers,
  login,
  me,
  register,
  updateUser,
} from "./src/users/users.service";
import cors from "cors";
import swaggerDocs from "./src/utils/swagger";
import checkAuth from "./src/middleware/checkAuth";
import { registerValidation } from "./src/middleware/checkUnique";
import { consol } from "./src/middleware/console";
const app: Express = express();

dotenv.config();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get("/tables", findAll);
app.post("/table", create);
app.patch("/table/:id", updateOneTable);
app.get("/table/:name", findOne);
app.delete("/table/:id", deleteOne);
app.get("/auth/me", checkAuth, me);
app.post("/auth/login", login);
app.post("/auth/register", registerValidation, register);
app.get("/users", getAllUsers);
app.patch("/user/:id", consol, updateUser);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  swaggerDocs(app, port);
});
