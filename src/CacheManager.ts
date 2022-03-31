import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CacheConfig, CacheDrivers, CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'
import FileStore from './Stores/File'

class CacheManager {
    private store: CacheStoreInterface

	constructor(app: ApplicationContract) {
        const config = app.container.use('Adonis/Core/Config')
		const driver: CacheDrivers  = config.get('default')

		switch (driver.toLowerCase()) {
			case 'file':
                const fileDriverConfig: CacheConfig['stores']['file'] = config.get('drivers.file')

                if (!fileDriverConfig) {
                    throw new Error('No driver config found for file.')
                }

                this.store = new FileStore(app.tmpPath(fileDriverConfig.path))
				break
		}
	}

    public async get(key: string): Promise<any> {
        return this.store.get(key)
    }

    public async set(key: string, data: any, duration: number): Promise<any> {
        return this.store.set(key, data, duration)
    }

    public async delete(key: string): Promise<Boolean> {
        return this.store.delete(key)
    }
}

export default CacheManager
