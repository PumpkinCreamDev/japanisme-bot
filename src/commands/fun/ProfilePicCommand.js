const CommandCore = require("../../handler/commandcore");
const { MessageEmbed } = require("discord.js");
const { get } = require("node-superfetch");
const cheerio = require("cheerio");

module.exports = class ProfilePicCommand extends CommandCore {
  constructor() {
    super({
      name: "profilepic",
      description: "Generate a random profile picture",
      usage: "pfp",
      cooldown: 0,
      aliases: [],
      devOnly: false,
      guildOnly: true,
      nsfw: false,
      clientPermission: [],
      authorPermission: []
    });
  }

  execute(client, message, args, thread) {
    const URI = "https://picrew.me";

    const { body } = thread.sync(get(URI));

    const $ = cheerio.load(body.toString());

    const imageSource = $(
      ".sitetop_discovery .sitetop_discovery_list_img img"
    ).attr("src");

    if (imageSource) {
      return message.channel.send("Here is your random profile picture.", {
        files: [imageSource]
      });
    }

    return message.channel.send("Fetching Error! Please Try Again.");
  }
};
