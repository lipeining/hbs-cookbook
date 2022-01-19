const ioredis = require("ioredis");
const redis = new ioredis(6379);

async function main() {
  await redis.del("tbuffer");
  await redis.set("tbuffer", Buffer.from("hello world"));
  console.log("end");
  const ret = await redis.get("tbuffer");
  console.log("ret=", ret);
  process.exit(0);
}
main();
