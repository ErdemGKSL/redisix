// const { createClient } = require('redis');

module.exports.RedisX = class RedisX {
  #redisClient;
  #namespace;
  #indexes;
  /** 
   * @param {import("redis").RedisClientType} redisClient
   * @param {string} namespace
   */
  constructor(namespace, redisClient, indexes = []) {
    this.#redisClient = redisClient;
    this.#namespace = namespace;
    this.#indexes = indexes;
  }

  /**
   * @param {object} value
   * @param {import("redis").SetOptions} options
   */
  async set(value, customIndexes = {}, options = {}) {
    const keys = this.#indexes.map(ix => ixv = customIndexes[ix] ?? value?.[ix], ixv ? `${this.#namespace}:${ix}:${ixv}` : null).filter(x => x);
    const pointer = (await this.#redisClient.get(keys[0])) || Math.random().toString(20).slice(2);
    await this.#redisClient.set(`$RX_POINTER:${this.#namespace}:${pointer}`, typeof value == "object" ? JSON.stringify(value) : value, options);
    for (let i = 0; i < keys.length; i++) await this.#redisClient.set(keys[i], pointer, options);
  }

  /**
   * 
   * @param {{[k: "index1"]: string}} query 
   * @param {*} defaultValue 
   * @param {*} options 
   * @returns 
   */
  async get(query, defaultValue) {
    let value = defaultValue;
    let pointer;

    for (let key in query) {
      pointer = await this.#redisClient.get(`${this.#namespace}:${key}:${query[key]}`);
      if (pointer) break;
    }

    if (pointer) value = await this.#redisClient.get(`$RX_POINTER:${this.#namespace}:${pointer}`);

    return value;
  }

  get indexList() {
    return this.#indexes;
  }

  get client() {
    return this.#redisClient;
  }

}
