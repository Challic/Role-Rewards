import { CustomCommand } from '../../classes/command';
import { Message, MessageEmbed } from 'discord.js';

export default class extends CustomCommand {
	public constructor() {
		super({
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	public async exec(message: Message): Promise<Message | Message[]> {
		const { username, id } = this.client.user!;
		const embed = new MessageEmbed()
			.setTitle(`${username} Commands`)
			.setDescription(`[Source](https://github.com/Shays-Bots/${username}) | [Support](https://discord.shaybox.com) | [Invite](https://bot.shaybox.com/${id})`)
			.setColor(6345206);

		this.handler.modules
			.filter(m => m.description)
			.filter(m => (message.guild ? true : m.channel !== 'guild'))
			.forEach(m => embed.addField(`${m.id} ${m.description.args || ''}`, m.description.help || ''));

		return message.util!.send(embed);
	}
}
