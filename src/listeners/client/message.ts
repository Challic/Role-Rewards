import { CustomListener } from '../../classes/listener';
import { Message } from 'discord.js';
import tmpl from 'reverse-string-template';

export default class extends CustomListener {
	public async exec(message: Message): Promise<void> {
		if (!message.guild) return;
		if (message.member!.id !== '159985870458322944') return;

		const entity = await message.guild.getEntity();
		const variables = tmpl(message.content, entity.format, { delimiters: ['{', '}'] });

		const member = message.guild.members.cache.find(m => m.id === variables.player);
		if (!member) return;

		const level = parseInt(variables.level, 10);
		if (!level) return;

		Object
			.entries(entity.roles)
			.forEach(async ([roleID, roleLevel]) => {
				if (roleLevel !== level) return;

				const role = message.guild!.roles.cache.find(r => r.id === roleID);
				if (role) {
					await member.roles.add(role);
				} else {
					delete entity.roles[roleID];
					message.guild!.updateEntity(entity);
				}
			});
	}
}
