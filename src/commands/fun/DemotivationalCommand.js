const CommandCore = require("../../handler/commandcore");
const { get } = require("node-superfetch");

module.exports = class DemotivationalCommand extends CommandCore {
  constructor() {
    super({
      name: "demotivational",
      description:
        "Draws an user's avatar and the text you specify as as a demotivational poster.",
      usage: "demotivational --title <title> --text <text> --avatar <@user>",
      cooldown: 5,
      aliases: [],
      devOnly: false,
      guildOnly: true,
      nsfw: false,
      clientPermission: ["ATTACH_FILES"],
      authorPermission: []
    });
  }
  execute(client, message, query, thread) {
    const { args, flags } = client.util.parseQuery(query);
    let title, text, user;

    if (flags.indexOf("title") !== -1) {
      title = args[flags.indexOf("title")];
    } else {
      return message.channel.send(
        "Please provide a title for the poster with flags `--title`!"
      );
    }

    if (flags.indexOf("text") !== -1) {
      text = args[flags.indexOf("text")];
    } else {
      return message.channel.send(
        "Please provide a text for the poster with flags `--text`!"
      );
    }

    if (flags.indexOf("avatar") !== -1) {
      user = message.mentions.users.first();
    } else {
      return message.channel.send(
        "Please mention someone to use their avatar as the poster using the flags ` --avatar`!"
      );
    }

    const { body } = thread.sync(
      get("https://emilia-api.glitch.me/api/demotivational")
        .query({
          title,
          text,
          image: user.displayAvatarURL({ format: "png", size: 1024 })
        })
        .set("Authorization", `Bearer ${process.env.EMILIAKEY}`)
    );

    return message.channel.send({
      files: [
        {
          attachment: body,
          name: "demotivational.png"
        }
      ]
    });
  }
}