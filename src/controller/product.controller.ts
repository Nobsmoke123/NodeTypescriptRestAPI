import { Request, Response } from "express";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../service/product.service";
import logger from "./../utils/logger";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  try {
    const userId = res.locals.user._id;
    const body = req.body;
    const product = await createProduct({
      ...body,
      user: userId,
    });
    return res.status(201).send(product);
  } catch (e: any) {
    logger.error(e.message);
    return res.status(500).send("Something went wrong!");
  }
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const update = req.body;

  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).send("Not found!");
  }

  if (String(product.user) !== userId) {
    return res.status(403).send("Forbidden!");
  }

  const updatedProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });

  return res.status(201).send(updatedProduct);
}

export async function getProductHandler(
  req: Request<GetProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;
  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).send("Not found!");
  }

  return res.status(200).send(product);
}

export async function deleteProductHandler(
  req: Request<DeleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).send("Not found!");
  }

  if (String(product.user) !== userId) {
    return res.status(403).send("Forbidden!");
  }

  await deleteProduct({ productId });

  return res.status(201).send("Done!");
}
