import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { CacheDrivers, CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'
import FileStore from './Stores/FileStore'

class CacheManager {
    private store: CacheStoreInterface

	constructor(config: ConfigContract) {
		const driver: CacheDrivers  = config.get('default')
		switch (driver.toLowerCase()) {
			case 'file':
                this.store = FileStore()
				break
		}
	}

    public async get(name: string): Promise<any> {
        return this.store.get(name)
    }

    public async set(name: string, data: any, duration: number): Promise<any> {
        return this.store.set(name, data, duration)
    }

    public async delete(name: string): Promise<Boolean> {
        return this.store.delete(name)
    }
}

export default CacheManager
