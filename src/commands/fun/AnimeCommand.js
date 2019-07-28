const CommandCore = require("../../handler/commandcore");
const { MessageEmbed } = require("discord.js");
const { get } = require("node-superfetch");
const cheerio = require("cheerio");

module.exports = class AnimeCommand extends CommandCore {
  constructor() {
    super({
      name: "anime",
      description: "Word Definition (Japanese - English)",
      usage: "anime",
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
    const MIN = 0;
    const MAX = 1270;
    const randNum = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    const URI = `https://www.randomanime.org/shows/${randNum}/`;

    const { body } = thread.sync(get(URI));

    const $ = cheerio.load(body.toString());

    const descriptionResult = $("[itemprop=about]")
      .text()
      .trim();
    const cleanDescription = descriptionResult.replace("...Read More", "");
    const description = cleanDescription.replace("Read Less", "");

    const detailsCollection = [];
    const detailsResult = $(".quick-info-container .quick-info li").each(
      (i, element) => {
        detailsCollection.push($(element).text());
      }
    );
    const details = detailsCollection.slice(0, detailsCollection.length - 1);

    const thumbnailSrc = `https://www.randomanime.org/images/shows/${randNum}/anime-l.jpg`;

    const TITLE = "Random Anime Info";

    const renderMainSection = () => {
      let result = "";
      for (
        let indexDetails = 0;
        indexDetails < details.length;
        indexDetails += 1
      ) {
        result += `${details[indexDetails]}
`;
      }
      return result;
    };

    const embeddedDefinition = new MessageEmbed()
      .setColor(`RANDOM`)
      .attachFiles([thumbnailSrc])
      .addField(TITLE, renderMainSection(), true)
      .addField("Description", description, true);

    return message.channel.send(embeddedDefinition);
  }
};
