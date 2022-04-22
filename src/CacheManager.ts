import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import {
    CacheConfig,
    CacheDrivers,
    CacheStoreInterface,
} from '@ioc:EstalaPaul/AdonisJSCache'
import FileStore from './Stores/File'

class CacheManager {
    private store: CacheStoreInterface

    constructor(app: ApplicationContract) {
        const config = app.container.use('Adonis/Core/Config')
        const driver: CacheDrivers = config.get('cache.driver')

        switch (driver.toLowerCase()) {
            case 'file':
                const fileDriverConfig: CacheConfig['stores']['file'] =
                    config.get('cache.stores.file')

                if (!fileDriverConfig) {
                    throw new Error('No driver config found for file.')
                }

                this.store = new FileStore(app.makePath(fileDriverConfig.path))
                break
        }
    }

    public async get(key: string): Promise<any> {
        return this.store.get(key)
    }

    public async has(key: string): Promise<boolean> {
        return this.store.has(key)
    }

    public async add(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<boolean> {
        return this.store.add(key, data, duration)
    }

    public async set(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<any> {
        return this.store.set(key, data, duration)
    }

    public async remember(
        key: string,
        callback: Function,
        duration: number | null = null
    ): Promise<any> {
        return await this.store.remember(key, callback, duration)
    }

    public async flush(): Promise<boolean> {
        return this.store.flush()
    }

    public async delete(key: string): Promise<boolean> {
        return this.store.delete(key)
    }

    public async keys(): Promise<Record<string, string>> {
        return this.store.keys()
    }
}

export default CacheManager
