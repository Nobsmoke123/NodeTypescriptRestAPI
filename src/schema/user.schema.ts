import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          example: jane.doe@example.com
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          example: Jane Doe
 *          default: Jane Doe
 *        password:
 *          type: string
 *          example: password12345
 *          default: password12345
 *        passwordConfirmation:
 *          type: string
 *          example: password12345
 *          default: password12345
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required!",
    }),
    password: string({
      required_error: "Password is required!",
    }).min(6, "Password too short - should be 6 characters minimum."),
    passwordConfirmation: string({
      required_error: "PasswordConfirmation is required!",
    }),
    email: string({
      required_error: "Email is required!",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match!",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
