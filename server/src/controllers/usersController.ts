import { Request, Response, json } from "express";
import cryto from "crypto";
import knex from "../database/connection";

class UsersController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const emailInDb = await knex("users").select("*").where("email", email);

    if (emailInDb.length !== 0)
      return res.json({ message: "Email already in use." });

    const id = cryto.randomBytes(8).toString("hex");

    const user = {
      id,
      email,
      password,
    };

    await knex("users").insert(user);

    return res.json({ id: id });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const id = await knex("users").select("id").where({
      email,
      password,
    }).first();

    if (!id)
      return res.json({message: "Invalid email or password."})

    return res.json(id);
  }
}

export default UsersController;
