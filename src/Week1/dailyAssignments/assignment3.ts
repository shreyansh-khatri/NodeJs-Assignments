import express, { Request, Response } from "express";
import Joi from "joi";
import { Brand,ErrorMessages } from "./interfaces";
import { brands } from "../utils";

const {
  alreadyExists,
  notFound,
  invalidId,
  portMessage,
  deleteMessage,
}: ErrorMessages = require("../utils.ts");

const app = express();
app.use(express.json());
const PORT: number = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`${portMessage} ${PORT}`);
});

app.get("/api/brands", (req: Request, res: Response) => {
  res.send(brands);
});

app.get("/api/brands/:id", (req: Request, res: Response) => {
  const brand = findBrand(parseInt(req.params.id));
  if (!brand) res.status(404).send(notFound);
  res.send(brand);
});

app.post("/api/brands/", (req: Request, res: Response) => {
  const isBrandFound = brands.find((item) => item.name === req.body.name);
  if (isBrandFound) res.send(alreadyExists);
  const { error, value } = validateBrand(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    const brand: Brand = {
      id: brands.length + 1,
      name: value.name,
    };
    brands.push(brand);
    res.send(brand);
  }
});

app.put("/api/brands/:id", (req: Request, res: Response) => {
  const brandId = parseInt(req.params.id);
  const isBrandFound = findBrand(brandId);
  if (!isBrandFound) res.status(404).send(invalidId);
  const { error, value } = validateBrand(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    brands[brandId - 1].name = value.name;
    res.send(brands[brandId - 1]);
  }
});

app.delete("/api/brands/:id", (req: Request, res: Response) => {
  const brand = findBrand(parseInt(req.params.id));
  if (!brand) res.status(404).send(invalidId);
  const index = brands.indexOf(brand!);
  brands.splice(index, 1);
  res.send(deleteMessage);
});

const validateBrand = (brand: { name: string }): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(brand);
};

const findBrand = (brandId: number): Brand => {
  const brand = brands.find((item) => item.id === brandId);
  return brand!;
};
