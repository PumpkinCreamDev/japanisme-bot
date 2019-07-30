const CommandCore = require("../../handler/commandcore");
const { MessageEmbed } = require("discord.js");

module.exports = class BanCommand extends CommandCore {
  constructor() {
    super({
      name: "ban",
      description: "Ban someone from your own Servers",
      usage: "ban @member --reason <reason>",
      cooldown: 5,
      aliases: [],
      devOnly: false,
      guildOnly: true,
      nsfw: false,
      clientPermission: ["BAN_MEMBERS"],
      authorPermission: ["BAN_MEMBERS"]
    });
  }

  execute(client, message, args, thread) {
    const query = client.util.parseQuery(args);
    const members =
      message.mentions.members.first() ||
      message.guild.members.get(args[0]) ||
      client.util.fetchMember(message.guild.members, args[0]);
    if (!members) return message.channel.send("Please mention a user!");
    let reason;
    if (query.flags.indexOf("reason") !== -1) {
      reason = query.args.slice(query.flags.indexOf("reason")+1).join(" ");
    } else {
      reason = args.slice(1).join(" ");
    }

    if (!reason || reason.length === 0) {
      reason = "No reason provided";
    }

    // CMMIW :3
    if (message.member.roles.highest.rawPosition < members.roles.highest.rawPosition)
      return message.channel.send(
        `${members.user.tag} cannot be banned. Maybe ${members.user.username}'s role is higher than yours`
      );
    if (members.roles.highest.rawPosition > message.guild.me.roles.highest.rawPosition)
      return message.channel.send(
        `${members.user.tag} Cannot be banned. Maybe ${members.user.username}'s role is higher than me?`
      );

    const embed = new MessageEmbed()
      .setColor("#7289DA")
      .setAuthor(
        `👢 You have been banned from ${message.guild.name}`,
        client.util.getGuildIcon(message.guild)
      )
      .setDescription(
        `Banned by **${message.author.tag}** at **${new Date()
          .toString()
          .split(" ", 6)
          .join(" ")}**.
Reason :
\`\`\`
${reason}
\`\`\`
      `
      )
      .setTimestamp()
      .setFooter(
        `• Regards, Staff ${message.guild.name}`,
        client.util.getAvatar(message.author)
      );

    try {
      thread.sync(members.ban(`${message.author.tag} | ${reason}`));
      thread.sync(members.user.createDM()).send(embed);
    } catch (e) {
      if (e.message === "Cannot send messages to this user") return; // CMMIW
      console.error(e);
    } finally {
      message.channel.send(
        `<:yes:587828147261538310> | **${members.user.tag}** has been ***banned*** from **${message.guild.name}**`
      );
    }
  }
};