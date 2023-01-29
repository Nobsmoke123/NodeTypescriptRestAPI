import { Express, Request, Response } from "express";

import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "./controller/product.controller";

import {
  createUserSessionHandler,
  deleteUserSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";

import { createUserHandler } from "./controller/user.controller";

import { requireUser, validateResource } from "./middleware/";

import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";

import { createSessionSchema } from "./schema/session.schema";

import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *    summary: Returns the health response of the system.
   *    tags:
   *      - Healthcheck
   *    description: Responds if the app is up and runninig
   *    responses:
   *      200:
   *        description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).send("ok!");
  });

  /**
   * @openapi
   * /api/users:
   *  post:
   *    summary: Register a new user
   *    tags:
   *      - User
   *    description: Creates a user resource on the server.
   *    parameters:
   *      - name: email
   *        in: body
   *        description: The email of the user.
   *        example: janedoe@example.com
   *      - name: name
   *        in: body
   *        description: The name of the user.
   *        example: jane Doe
   *      - name: password
   *        in: body
   *        description: The password of the user.
   *        example: password12345
   *      - name: passwordConfirmation
   *        in: body
   *        description: The passwordConfirmation of the user.
   *        example: password12345
   *
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateUserInput'
   *    responses:
   *      200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   *
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteUserSessionHandler);

  app.post(
    "/api/products",
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );

  /**
   * @openapi
   * '/api/products/{productId}':
   *  get:
   *    tags:
   *      - Products
   *    summary: Get a single product by the productId.
   *    description: Retrieve a single product using the productId.
   *    parameters:
   *      - name: productId
   *        in: path
   *        description: The ID of the product.
   *        required: true
   *    responses:
   *      200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Product'
   *      404:
   *        description: Not Found!
   */
  app.get(
    "/api/products/:productId",
    validateResource(getProductSchema),
    getProductHandler
  );

  app.put(
    "/api/products/:productId",
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
