import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { createConnection } from 'typeorm';

export default class CustomClient extends AkairoClient {
	public commandHandler: CommandHandler;
	public listenerHandler: ListenerHandler;
	public constructor() {
		super({ ownerID: '358558305997684739' }, {
			messageCacheMaxSize: 10,
			messageCacheLifetime: 60,
			messageSweepInterval: 60 * 30,
			disableMentions: 'everyone',
			presence: {
				activity: {
					name: 'chat',
					type: 'WATCHING',
				},
			},
		});

		this.commandHandler = new CommandHandler(this, {
			allowMention: true,
			automateCategories: true,
			commandUtil: true,
			directory: 'src/commands',
			handleEdits: true,
			prefix: async message => message.guild ? (await message.guild.getEntity()).prefix : 'r!',
		});

		this.listenerHandler = new ListenerHandler(this, {
			automateCategories: true,
			directory: 'src/listeners',
		});
	}

	public async login(token?: string): Promise<string> {
		await createConnection({
			type: 'postgres',
			url: process.env.DATABASE_URL,
			synchronize: true,
			logging: false,
			entities: [
				'src/entity/**/*.ts',
			],
			cli: {
				entitiesDir: 'src/entity',
			},
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();

		return super.login(token);
	}
}
