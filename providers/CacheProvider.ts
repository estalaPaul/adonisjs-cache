import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import CacheManager from '../src/CacheManager'

export default class CacheProvider {
	constructor(protected app: ApplicationContract) {}

	public register() {
		this.app.container.singleton('EstalaPaul/Adonis-Cache', () => {
			return new CacheManager(this.app)
		})

		this.app.container.alias('EstalaPaul/Adonis-Cache', 'Cache')
	}
}
