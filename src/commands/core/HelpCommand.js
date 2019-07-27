const CommandCore = require("../../handler/commandcore");
const { MessageEmbed } = require("discord.js");

module.exports = class HelpCommand extends CommandCore {
  constructor() {
    super({
      name: "help",
      description: "All of my commands list.",
      usage: "help [command]",
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
    const embed = new MessageEmbed();
    if (args[0]) {
      const commandClass = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
      if (!commandClass) {
        embed.setColor("RANDOM")
        .setDescription(`Command \`${args[0]}\` doesn't exist!`);
        message.channel.send(embed);
      } else {
        embed.setTitle(`:grey_question: ${commandClass.meta.name}`)
        .setColor("RANDOM")
        .setDescription(commandClass.meta.description)
        .addField("Usage", `${commandClass.meta.usage}`)
        .addField("Aliases", `${commandClass.meta.aliases.length ? commandClass.meta.aliases.join(", ") : "None"}`);
        message.channel.send(embed);
      }
    } else {
      embed.setAuthor(`${client.user.username}'s Commands List.`)
      .setColor("RANDOM")
      .setTimestamp();

      const modules = client.modules.array().sort((a, z) => a.name.localeCompare(z.name));
      modules.forEach(m => {
        embed.addField(toTitleCase(m.name), m.commands.sort((a, z) => a.meta.name.localeCompare(z.meta.name)).map(cmd => `\`${cmd.meta.name}\``).join(", "));
      })
      message.channel.send(embed)
    }
    return;
  }
};

function toTitleCase(str) {
  str = str.toLowerCase().split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}