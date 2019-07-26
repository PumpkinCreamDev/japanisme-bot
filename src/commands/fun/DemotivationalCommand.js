const CommandCore = require("../../handler/commandcore");
const { get } = require("node-superfetch");

class DemotivationalCommand extends CommandCore {
	constructor() {
		super({
			name: "demotivational",
			description: "Draws an user\'s avatar and the text you specify as as a demotivational poster.", 
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
		
		if (flags[0] && flags[0] === "title") {
			title = args.join(" ");
		} else {
			return message.channel.send("Please provide a title for the poster with flags `--title`!");
		}
		
		if (flags[1] && flags[1] === "text") {
			text = args.slice(title.length).join(" ");
		} else {
			return message.channel.send("Please provide a text for the poster with flags `--text`!");
		}
		
		if (flags[2] && flags[2] === "avatar") {
			user = message.mentions.users.first();
		} else {
			return message.channel.send("Please mention someone to use their avatar as the poster using the flags `--avatar`!");
		}
		
		const { body } = thread.sync(get("https://emilia-api.glitch.me/api/demotivational").query({
			title,
			text,
			image: user.displayAvatarURL({ format: "png", size: 2048 })
		}));
		
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

module.exports = DemotivationalCommand;
