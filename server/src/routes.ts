import express from "express";
import { celebrate, Joi } from "celebrate";

import multer from "multer";
import multerConfig from "./config/multer";

import UsersController from "./controllers/usersController";
import PointsController from "./controllers/pointsController";
import ItemsController from "./controllers/itemsController";

const routes = express.Router();
const upload = multer(multerConfig);

const usersController = new UsersController();
const pointsController = new PointsController();
const itemsController = new ItemsController();

//index, show, create, update, delete
routes.get("/items", itemsController.index);

routes.post("/register", usersController.create);
routes.post("/login", usersController.login);

routes.get("/user_points", pointsController.list);

routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);
routes.delete("/points", pointsController.delete);
routes.post(
  "/points", 
  upload.single("image"),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }), 
  pointsController.create)
;

export default routes;
