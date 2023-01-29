import { number, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *        - title
 *        - description
 *        - image
 *        - price
 *      properties:
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        price:
 *          type: number
 *        image:
 *          type: string
 */
const productPayload = {
  body: object({
    title: string({
      required_error: "Title is required!",
    }),
    description: string({
      required_error: "Description is required!",
    }).min(50, "Description should be at least 50 characters long!"),
    price: number({
      required_error: "Price is required!",
    }),
    image: string({
      required_error: "Image is required!",
    }),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "ProductId is required!",
    }),
  }),
};

export const createProductSchema = object({
  ...productPayload,
});

export const updateProductSchema = object({
  ...productPayload,
  ...params,
});

export const getProductSchema = object({
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type GetProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
