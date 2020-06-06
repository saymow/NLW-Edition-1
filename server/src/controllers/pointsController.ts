import { Response, Request } from "express";
import knex from "../database/connection";

class PointsController {
  async list(req: Request, res: Response) {
    const { user_id } = req.headers;

    if (!user_id)
      return res.status(401).json({ message: "No user id provided" });

    const response = await knex("points")
      .select(
        "points.*",
        knex.raw("GROUP_CONCAT(point_items.item_id) as items"),
        knex.raw("GROUP_CONCAT(items.title) as itemsTitle")
      )
      .join("point_items", "points.id", "=", "point_items.point_id")
      .leftJoin("items", "items.id", "=", "point_items.item_id")
      .where("user_id", String(user_id))
      .groupBy("points.id");

    console.log(response);

    const serializedResponse = response.map((data) => {
      delete data["user_id"];
      return {
        ...data,
        image_url: `http://192.168.15.2:3333/uploads/${data.image}`,
        items: data.items.split(","),
        itemsTitle: data.itemsTitle.split(","),
      };
    });

    return res.json(serializedResponse);
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItem = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    // SELECT distinct(points.*) FROM points
    // INNER JOIN point_items on points_id = point_items_point_id
    // WHERE points_items.item_id IN [?]
    // AND city = ?
    // AND uf = ?

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .leftJoin("items", "items.id", "=", "point_items.item_id")
      .whereIn("point_items.item_id", parsedItem)
      .where("city", String(city))
      .where("uf", String(uf))
      .select("points.*", knex.raw("GROUP_CONCAT(items.title) as itemsTitle"))
      .groupBy("points.id");

    const serializedPoints = points.map((point) => {
      delete point["user_id"];
      return {
        ...point,
        itemsTitle: point.itemsTitle.split(","),
        image_url: `http://192.168.15.2:3333/uploads/${point.image}`,
      };
    });
    
    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex("points").where("id", id).first();

    if (!point) return res.status(400).json({ message: "Point not found." });

    const serializedPoint = {
        ...point,
        image_url: `http://192.168.15.2:3333/uploads/${point.image}`,
    };

    console.log(id);

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    delete serializedPoint["user_id"];

    return res.json({ point: serializedPoint, items });
  }

  async create(req: Request, res: Response) {
    const { user_id } = req.headers;

    console.log(req.headers);
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    if (!user_id)
      return res.status(401).json({ message: "No user id provided" });

    const userData = await knex("users").where("id", user_id);

    if (userData.length === 0)
      return res
        .status(401)
        .json({ message: "You must be logged in order to create a point." });

    const trx = await knex.transaction();

    const point = {
      user_id,
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedids = await trx("points").insert(point);

    const point_id = insertedids[0];

    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    await trx("point_items").insert(pointItems);

    await trx.commit();

    delete point["user_id"];

    return res.json({
      id: point_id,
      ...point,
    });
  }

  async delete(req: Request, res: Response) {
    const { user_id } = req.headers;
    const { id } = req.body;

    if (!user_id)
      return res.status(401).json({ message: "No user id provided" });

    const userData = await knex("users").where("id", user_id);

    if (userData.length === 0)
      return res
        .json(401)
        .json({ message: "You must be logged in order to delete a point." });

    const point = await knex("points").where("id", id).first();

    if (!point) return res.status(400).json({ message: "Point not found." });

    const trx = await knex.transaction();

    await trx("points").where("id", id).del();
    await trx("point_items").where("point_id", id).del();

    await trx.commit();

    return res.json({ message: "Successfully deleted" });
  }
}

export default PointsController;
