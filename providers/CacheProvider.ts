import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import CacheManager from '../src/CacheManager'

export default class CacheProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {
        this.app.container.singleton('EstalaPaul/AdonisJSCache', () => {
            return new CacheManager(this.app)
        })
    }
}
