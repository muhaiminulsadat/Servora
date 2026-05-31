import {createClient, type RedisClientType} from "redis";

let client: RedisClientType;

export const connectRedis = async () => {
  client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD!,
    socket: {
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!),
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  console.log("Connected to Redis");
};

export const getRedisClient = (): RedisClientType => {
  if (!client) {
    throw new Error("Redis client is not connected");
  }
  return client;
};
