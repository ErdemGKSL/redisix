const { RedisX } = require(".");

const rx = new RedisX("test", redis, ["userId"]);
// const someUser;
rx.set(someUser, { userId: "1234654464" }, {EX: 360});
rx.get({ userId: "1234654464" });