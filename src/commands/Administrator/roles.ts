import { CustomCommand } from '../../classes/command';
import { inlineCodeblock } from 'discord.js-utilities';
import { Message, MessageEmbed, Role } from 'discord.js';

export default class extends CustomCommand {
	public constructor() {
		super({
			args: [{
				id: 'action',
				type: (_, phrase) => ['get', 'set', 'remove'].includes(phrase) ? phrase : undefined,
			}, {
				id: 'role',
				type: 'role',
			}, {
				id: 'level',
				type: 'number',
			}],
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				help: 'Customize what role to reward for each level',
				args: '[add/remove/show] (role) (level)',
			},
		});
	}

	public async exec(message: Message, { action, role, level }: { action?: string; role?: Role; level?: number }): Promise<Message | Message[]> {
		const entity = await message.guild!.getEntity();

		let content;
		switch (action) {
			case 'show':
			case 'get': {
				const fields = Object
					.entries(entity.roles)
					.map(([roleID, level]) => {
						const role = message.guild!.roles.cache.get(roleID);
						if (!role) {
							delete entity.roles[roleID];
							message.guild!.updateEntity(entity);
						}
						return {
							name: `Role ${role ? role.name : roleID}`,
							value: `Level ${level}`,
						};
					});

				const embed = new MessageEmbed()
					.setTitle('Role Rewards')
					.addFields(fields)
					.setColor(6345206);

				if (fields.length === 0) content = 'There are no roles setup';
				else return message.util!.send(embed);
				break;
			}

			case 'add':
			case 'set': {
				if (message.member!.hasPermission('ADMINISTRATOR') || message.member! === message.guild!.owner!) {
					if (role) {
						if (level) {
							entity.roles[role.id] = level;
							message.guild!.updateEntity(entity);
							content = `Set role ${inlineCodeblock(role.name)} to level ${inlineCodeblock(level.toString())}`;
						} else { content = 'Invalid level given'; }
					} else { content = 'Invalid role given'; }
				} else { content = 'You do not have permission to change the levelup roles'; }
				break;
			}

			case 'delete':
			case 'remove': {
				if (message.member!.hasPermission('ADMINISTRATOR') || message.member! === message.guild!.owner!) {
					if (role) {
						delete entity.roles[role.id];
						message.guild!.updateEntity(entity);
						content = `Removed role ${inlineCodeblock(role.name)}`;
					} else { content = 'Invalid role given'; }
				} else { content = 'You do not have permission to change the levelup roles'; }
				break;
			}

			default: {
				content = 'Invalid action given, available actions: `get/show`, `set/add`, `remove/delete`';
				break;
			}
		}

		return message.util!.send(content, { embed: undefined });
	}
}
