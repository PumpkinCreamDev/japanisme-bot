const CommandCore = require("../../handler/commandcore");
const { get } = require("node-superfetch");

module.exports = class BeautifulCommand extends CommandCore {
  constructor() {
    super({
      name: "beautiful",
      description:
        "Draws a user's avatar over Gravity Falls' \"Oh, this? This is beautiful.\" meme.",
      usage: "beautiful [user]",
      cooldown: 6,
      aliases: [],
      devOnly: false,
      guildOnly: true,
      nsfw: false,
      clientPermission: ["ATTACH_FILES"],
      authorPermission: []
    });
  }

  execute(client, message, args, thread) {
    try {
      const user =
        message.mentions.users.first() ||
        client.users.get(args[0]) ||
        message.author;
      const { body } = thread.sync(
        get("https://emilia-api.glitch.me/api/beautiful")
          .query({
            image: user.displayAvatarURL({ format: "png", size: 1024 })
          })
          .set("Authorization", `Bearer ${process.env.EMILIAKEY}`)
      );
      return message.channel.send({ files: [{ attachment: body }] });
    } catch (e) {
      return message.channel.send(e.message);
    }
  }
};
