const CommandCore = require("../../handler/commandcore");
const { MessageEmbed } = require("discord.js");
const { get } = require("node-superfetch");
const cheerio = require("cheerio");

module.exports = class DefinitionCommand extends CommandCore {
  constructor() {
    super({
      name: "definition",
      description: "Word Definition (Japanese - English)",
      usage: "definition",
      cooldown: 0,
      aliases: ["def"],
      devOnly: false,
      guildOnly: true,
      nsfw: false,
      clientPermission: [],
      authorPermission: []
    });
  }

  execute(client, message, args, thread) {
    const _arguments = args.length > 1 ? args.join("%20") : args[0];

    const URI = `http://www.romajidesu.com/dictionary/meaning-of-${_arguments}.html`;

    const { body } = thread.sync(get(URI));

    const $ = cheerio.load(body.toString());

    const romajiElements = $(".word_kana")
      .text()
      .trim();
    const romajiConvoluted = romajiElements.split(/\s/g);
    const romajiCollection = romajiConvoluted.filter(
      value => value && value !== "·"
    );
    const romajiResults = romajiCollection.slice(0, 5);

    const meaningsElements = $(".word_meanings")
      .text()
      .trim();
    const meaningsConvoluted = meaningsElements.split(/\s/g);
    const meaningsCollection = meaningsConvoluted.filter(value => value);

    const exampleJapaneseIndexes = [];
    const exampleJapanese = meaningsCollection.filter((value, index) => {
      if (value.includes("。")) {
        exampleJapaneseIndexes.push(index);
        return true;
      }
      return false;
    });

    const exampleFirstEnglishWordIndexes = [];
    const exampleFirstEnglishWord = meaningsCollection.filter(
      (value, index) => {
        if (value.includes("(")) {
          exampleFirstEnglishWordIndexes.push(index);
          return true;
        }
        return false;
      }
    );

    const firstDefinitionEnglish = meaningsCollection
      .slice(0, exampleJapaneseIndexes[0])
      .join(" ");
    const firstDefinitionJapanese = exampleJapanese[0];
    const firstDefinitionJapaneseMeans = meaningsCollection
      .slice(exampleJapaneseIndexes[0] + 1, exampleFirstEnglishWordIndexes[1])
      .join(" ");

    const cleanRelatedWords = words => {
      const arrowIndex = words.indexOf("→");
      if (arrowIndex !== -1) {
        return words.slice(0, arrowIndex - 1);
      }
      return words || "";
    };

    const title = `Results of _${args.join(" ")}_ in Japanese`;

    const renderResults = () => {
      let result = "";
      romajiResults.forEach(value => {
        result += `${value.replace("(", " (")}
`;
      });
      return result;
    };

    const renderMeaning = () => cleanRelatedWords(firstDefinitionEnglish);

    const renderExamples = () => {
      return `${firstDefinitionJapanese || ""}
${cleanRelatedWords(firstDefinitionJapaneseMeans)}`;
    };

    const embeddedDefinition = new MessageEmbed()
      .setColor(`RANDOM`)
      .addField(title, renderResults(), true)
      .addField("Meaning", renderMeaning(), true)
      .addField("Example", renderExamples(), true);

    return message.channel.send(embeddedDefinition);
  }
};
