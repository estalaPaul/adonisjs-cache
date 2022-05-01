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

    /**
     * Checks if the given key exists as file cache entry.
     *
     * @param key The key for which to check for.
     */
    public async has(key: string): Promise<boolean> {
        return this.store.has(key)
    }

    /**
     * Attempts to retrieve and return the given key from file cache if it exists and it is not expired.
     *
     * @param key The key for which to retrieve the file cache entry for.
     */
    public async get(key: string): Promise<any> {
        return this.store.get(key)
    }

    /**
     * Creates a new cache entry only if it does not exists. Returns true if the cache
     * entry was created, false otherwise.
     *
     * @param key The key for which to check for.
     * @param data The data to save in the cache entry.
     * @param duration
     * Number of seconds the cache entry should last.
     * If no duration is given, the cache will be
     * saved until it is explicitly deleted.
     */
    public async add(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<boolean> {
        return this.store.add(key, data, duration)
    }

    /**
     * Creates or overwrites a file cache entry with the given key and returns the stored data.
     *
     * @param key The key for which to create the file cache entry for.
     * @param data The data to save in the cache entry.
     * @param duration
     * Number of seconds the cache entry should last.
     * If no duration is given, the cache will be
     * saved until it is explicitly deleted.
     */
    public async set(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<any> {
        return this.store.set(key, data, duration)
    }

    /**
     * Attempts to retrieve the given value from cache and if no
     * value is found, it creates a new file cache entry with
     * the value retrieved from the callback given.
     *
     * @param key The key for which to create the file cache entry for.
     * @param callback
     * Function to use to set value if cache entry with
     * given key does not exist.
     * @param duration
     * Number of seconds the cache entry should last.
     * If no duration is given, the cache will be
     * saved until it is explicitly deleted.
     */
    public async remember(
        key: string,
        callback: Function,
        duration: number | null = null
    ): Promise<any> {
        return await this.store.remember(key, callback, duration)
    }

    /**
     * Attempts to delete a file cache entry with the given key. Returns true on success and false on failure.
     *
     * @param key The key for which to delete the file cache entry for.
     */
    public async delete(key: string): Promise<boolean> {
        return this.store.delete(key)
    }

    /**
     * Attempts to remove all file cache entries. Returns true on success and false on failure.
     */
    public async flush(): Promise<boolean> {
        return this.store.flush()
    }

    /**
     * Retrieves and returns all the keys currently stored in the file cache.
     */
    public async keys(): Promise<string[]> {
        return this.store.keys()
    }
}

export default CacheManager
