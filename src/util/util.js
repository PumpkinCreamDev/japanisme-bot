const request = require("node-superfetch");

module.exports = class Util {
  constructor(Discord, client) {
    this.getAvatar = user => {
      let isGif = client.users
        .resolve(user)
        .displayAvatarURL()
        .split(".");
      isGif = isGif[isGif.length - 1] === "gif";
      const final = isGif ? { format: "gif" } : { format: "png" };
      return client.users.resolve(user).displayAvatarURL(final);
    };

    this.hastebin = async text => {
      const { body } = await request
        .post("https://hasteb.in/documents")
        .send(text);
      return `https://hasteb.in/${body.key}`;
    };

    this.parseQuery = queries => {
      const args = [];
      const flags = [];
      for (const query of queries) {
        if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
        else args.push(query);
      }
      return { args, flags };
    };
  }
};
