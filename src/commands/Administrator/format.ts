import { CustomCommand } from '../../classes/command';
import { inlineCodeblock } from 'discord.js-utilities';
import { Message } from 'discord.js';

export default class extends CustomCommand {
	public constructor() {
		super({
			args: [{
				id: 'newFormat',
				match: 'content',
			}],
			channel: 'guild',
			description: {
				help: 'Change the format to match Mee6\'s format',
				args: '(new format)',
			},
		});
	}

	public async exec(message: Message, { newFormat }: { newFormat?: string }): Promise<Message | Message[]> {
		const entity = await message.guild!.getEntity();

		let content;
		if (newFormat) {
			if (message.member!.hasPermission('ADMINISTRATOR') || message.member! === message.guild!.owner!) {
				entity.format = newFormat;
				message.guild!.updateEntity(entity);
				content = `Updated format to ${newFormat}`;
			} else {
				content = 'You do not have permission to change the format';
			}
		} else {
			content = [
				`Current format is ${inlineCodeblock(entity.format)}`,
				`Type ${inlineCodeblock(`${entity.prefix}format (new format)`)} to change the format`,
				`Please copy it directly from <https://mee6.xyz/dashboard/${message.guild!.id}/levels>`,
			];
		}

		return message.util!.send(content, { embed: undefined });
	}
}
