import knex from "../database/connection";
import { Response, Request } from "express";

class ItemsController {
  async index(req: Request, res: Response) {
    const data = await knex("items").select("*");

    const serializedItems = data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.15.2:3333/uploads/${item.image}`,
      };
    });

    return res.json(serializedItems);
  }
}

// 192.168.15.2:3333

export default ItemsController;
