import { NextFunction, Request, Response } from "express";
import config from "config";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import { omit } from "lodash";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password!");
  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");
  // Create an access token
  if (!session) {
    return res.status(400).send("Something went wrong");
  }

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") }
  );
  // Create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTtl") }
  );
  // Return access & refresh tokens
  return res.status(200).send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  res.status(200).send(omit(sessions[0], "__v"));
}

export async function deleteUserSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.status(200).send({
    accessToken: null,
    refreshToken: null,
  });
}
