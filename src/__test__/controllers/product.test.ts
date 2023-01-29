import supertest from "supertest";
import createServer from "../../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createProduct } from "../../service/product.service";
import { signJwt } from "../../utils/jwt.utils";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

const TEST_PRODUCT_ONE = {
  user: userId,
  title: "PRODUCT ONE",
  description:
    "TEST DESCRIPTION THAT SHOULD BE UP TO 50 CHARACTERS MINIMUM.....",
  price: 900.0,
  image: "https://i.imgur.com/!UIH!IHJ!IHK()@()-090090.jpg",
};

const TEST_PRODUCT_TWO = {
  user: userId,
  title: "PRODUCT TWO",
  description:
    "TEST DESCRIPTION THAT SHOULD BE UP TO 50 CHARACTERS MINIMUM.....",
  price: 900.0,
  image: "https://i.imgur.com/!UIH!IHJ!IHK()@()-090090.jpg",
};

const TEST_PRODUCT_THREE = {
  user: userId,
  title: "PRODUCT THREE",
  description:
    "TEST DESCRIPTION THAT SHOULD BE UP TO 50 CHARACTERS MINIMUM.....",
  price: 900.0,
  image: "https://i.imgur.com/!UIH!IHJ!IHK()@()-090090.jpg",
};

const TEST_PRODUCT_RESPONSE = {
  __v: 0,
  _id: expect.any(String),
  createdAt: expect.any(String),
  description:
    "TEST DESCRIPTION THAT SHOULD BE UP TO 50 CHARACTERS MINIMUM.....",
  image: "https://i.imgur.com/!UIH!IHJ!IHK()@()-090090.jpg",
  price: 900,
  productId: expect.any(String),
  title: "PRODUCT THREE",
  updatedAt: expect.any(String),
  user: expect.any(String),
};

const userPayload = {
  name: "jane doe",
  email: "janedoe@gmail.com",
  _id: userId,
};

describe("product", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({});
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop({ doCleanup: true, force: true });
  });

  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return a 404 status", async () => {
        const productId = "product-123";
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        const product = await createProduct(TEST_PRODUCT_ONE);
        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403 status", async () => {
        const { statusCode } = await supertest(app)
          .post("/api/products")
          .send(TEST_PRODUCT_TWO);
        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 status and create the product", async () => {
        const jwt = signJwt(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/products")
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${jwt}`)
          .send(TEST_PRODUCT_THREE);

        expect(statusCode).toBe(201);
        expect(body).toEqual(TEST_PRODUCT_RESPONSE);
      });
    });
  });
});
