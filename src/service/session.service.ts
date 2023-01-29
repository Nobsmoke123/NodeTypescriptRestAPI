import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { ISession } from "../models/session.model";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import logger from "./../utils/logger";
import { findUser } from "./user.service";
import config from "config";

export async function createSession(userId: string, userAgent: string) {
  try {
    const session = await SessionModel.create({
      user: userId,
      userAgent,
    });
    return session.toJSON();
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e);
  }
}

export async function findSessions(query: FilterQuery<ISession>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<ISession>,
  update: UpdateQuery<ISession>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return "";

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return "";

  const user = await findUser({ _id: session?.user });

  if (!user) return "";

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") }
  );

  return accessToken;
}
