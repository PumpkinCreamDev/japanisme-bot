const CommandCore = require("../../handler/commandcore");
const { MessageEmbed } = require("discord.js");
const { get } = require("node-superfetch");
const cheerio = require("cheerio");

class WOTDCommand extends CommandCore {
  constructor() {
    super({
      name: "wotd",
      description: "Japanese Word of the Day",
      usage: "wotd",
      cooldown: 5,
      aliases: [],
      devOnly: false,
      guildOnly: true,
      nsfw: false,
      clientPermission: [],
      authorPermission: []
    });
  }

  execute(client, message, args, thread) {
    const URI = "https://www.japanesepod101.com/japanese-phrases";

    const { body } = thread.sync(get(URI));

    const $ = cheerio.load(body.toString());

    const pictureSource = $(".r101-wotd-widget__image").attr("src");

    // First Section
    const kana = $(
      ".r101-wotd-widget__section--first .r101-wotd-widget__additional-field.kana"
    )
      .text()
      .trim();
    const romaji = $(
      ".r101-wotd-widget__section--first .r101-wotd-widget__additional-field.romaji"
    )
      .text()
      .trim();
    const english = $(
      ".r101-wotd-widget__section--first .r101-wotd-widget__english"
    )
      .text()
      .trim();
    const englishClass = $(".r101-wotd-widget__class")
      .text()
      .trim();

    // Second Section
    const exampleKana = $(
      ".r101-wotd-widget__section .r101-wotd-widget__additional-field.kana"
    )
      .text()
      .trim()
      .split("\n");
    const exampleRomaji = $(
      ".r101-wotd-widget__section .r101-wotd-widget__additional-field.romaji"
    )
      .text()
      .trim()
      .split("\n");
    const exampleEnglish = $(
      ".r101-wotd-widget__section .r101-wotd-widget__english"
    )
      .text()
      .trim()
      .split(".");

    // rendering
    const renderMainSection = () => `${kana}
${romaji}
${english} (${englishClass})`;

    const renderExamples = () => {
      let result = "";

      for (let i = 0; i < exampleKana.length; i++) {
        result += `${exampleKana[i].trim()}
${exampleRomaji[i].trim()}
${exampleEnglish[i].trim()}

`;
      }

      return result;
    };

    const embeddedWOTD = new MessageEmbed()
      .setColor(`RANDOM`)
      .setThumbnail(pictureSource)
      .addField("Japanese Word of the Day", renderMainSection(), true)
      .addBlankField(true)
      .addField("Example", renderExamples(), true);

    return message.channel.send(embeddedWOTD);
  }
}

module.exports = WOTDCommand;
