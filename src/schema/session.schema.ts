import { object, string } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateSessionInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          example: jane.doe@example.com
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          example: password12345
 *          default: password12345
 *
 */
export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "The email is required!",
    }),
    password: string({
      required_error: "The password is required!",
    }),
  }),
});
