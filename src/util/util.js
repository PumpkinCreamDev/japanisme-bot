const request = require("node-superfetch");

module.exports = class Util {
  constructor(Discord, client) {
    this.getGuildIcon = guild => {
      if (guild.iconURL === null) return guild.iconURL();
      let isGif = guild.iconURL().split(".");
      isGif = isGif[isGif.length - 1] === "gif";
      const final = isGif ? { format: "gif" } : { format: "png" };
      return guild.iconURL(final);
    };

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

    this.toTitleCase = str => {
      str = str.toLowerCase().split(" ");
      for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(" ");
    };

    this.fetchMembers = (members, name) => {
      const regex = new RegExp("^(?:<@​&?)?([0-9]+)>?$");
      if (!name || name === undefined) return undefined;
      if (regex.test(name)) name = name.replace(regex, "$1");
      const member = members.filter(r =>
        r.displayName.toLowerCase().includes(name && name.toLowerCase())
      );
      if (member) return member.first();
      else return undefined;
    };
  }
};
