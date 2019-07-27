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
      cooldown: 0,
      aliases: [],
      devOnly: true,
      guildOnly: false,
      nsfw: false,
      clientPermission: [],
      authorPermission: []
    });
  }

  execute(client, message, args, thread) {
    const URI = "https://www.japanesepod101.com/japanese-phrases";

    const { body } = thread.sync(get(URI));

    const $ = cheerio.load(body.toString());

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

    const renderMainSection = () => `${kana}
${romaji}
${english} (${englishClass})`;

    const renderExamples = () => {
      let result = "";

      for (let i = 0; i < exampleKana.length; i++) {
        result += `${exampleKana[i]}
${exampleRomaji[i]}
${exampleEnglish[i]}

`;
      }

      return result;
    };

    const pingembed = new MessageEmbed()
      .setColor(`RANDOM`)
      .addField("Japanese Word of the Day", renderMainSection(), true)
      .addBlankField(true)
      .addField("Example", renderExamples(), true);

    return message.channel.send(pingembed);
  }
}

module.exports = WOTDCommand;
