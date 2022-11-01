const { RedisX } = require(".");

const rx = new RedisX("test", redis, ["sa", "as", "ne"]);

rx.set(Obje, { userId: "1234654464" }, {EX: 31});
rx.get({ userId: "1234654464" }, "31");