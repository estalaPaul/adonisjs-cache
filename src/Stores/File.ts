import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm, mkdir } from 'fs/promises'
import crypto from 'crypto'

class File implements CacheStoreInterface {
    private directory: string

    private keysDirectory: string

    constructor(directoryPath: string) {
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, { recursive: true })
        }

        const directory = `${directoryPath}/cache`
        if (!existsSync(directory)) {
            mkdirSync(directory)
        }

        const keysDirectory = `${directoryPath}/keys`
        if (!existsSync(keysDirectory)) {
            mkdirSync(keysDirectory)
        }

        this.directory = directory
        this.keysDirectory = keysDirectory
    }

    /**
     * Attempts to retrieve and return the given key from file cache if it exists and it is not expired.
     *
     * @param key The key for which to retrieve the file cache entry for.
     */
	public async get(key: string): Promise<any> {
        try {
            const contents = JSON.parse(await readFile(this.path(key), { encoding: 'utf-8' }))

            if (!('data' in contents) || !('time' in contents)) {
                return null
            }

            // A null time means it was set to remember forever.
            if (contents.time === null) {
                return contents.data
            }

            if (contents.time < new Date().getTime()) {
                await this.delete(key)
                return null
            }

            return contents.data
        } catch (error) {
            return null
        }
	}

    /**
     * Checks if the given key exists as file cache entry.
     *
     * @param key The key for which to check for.
     */
    public async has(key: string): Promise<boolean> {
        return await this.get(key) !== null
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
     * saved until it is implicitly deleted.
     */
    public async add(key: string, data: any, duration: number | null = null): Promise<boolean> {
        if (await this.has(key)) {
            return false
        }

        await this.set(key, data, duration)
        await this.storeKey(key)
        return true
    }

    /**
     * Creates or overwrites a file cache entry with the given key and returns the stored data.
     *
     * @param key The key for which to create the file cache entry for.
     * @param data The data to save in the cache entry.
     * @param duration 
     * Number of seconds the cache entry should last.
     * If no duration is given, the cache will be
     * saved until it is implicitly deleted.
     */
	public async set(key: string, data: any, duration: number | null = null): Promise<any> {
        const contents = {
            data: data,
            time: duration !== null ? new Date().getTime() + duration : null
        }

        await writeFile(this.path(key), JSON.stringify(contents))
        await this.storeKey(key)
        return contents
	}

    /**
     * Attempts to file cache entry with the given key. Returns true on success and false on failure.
     *
     * @param key The key for which to delete the file cache entry for.
     */
	public async delete(key: string): Promise<boolean> {
        try {
            await rm(this.path(key))
            await this.removeKey(key)
            return true
        } catch (error) {
            return false
        }
	}

    /**
     * Attempts to remove all file cache entries. Returns true on success and false on failure.
     */
    public async flush(): Promise<boolean> {
        try {
            await rm(`${this.directory}`, { recursive: true })
            await mkdir(this.directory)
            await rm(`${this.keysDirectory}/keys`)
            return true;
        } catch (error) {
            console.log(error)
            return false
        }
    }

    /**
     * Retrieves and returns all the keys currently stored in the file cache.
     */
    public async keys(): Promise<Record<string, string>> {
        const path = `${this.keysDirectory}/keys`
        try {
            return JSON.parse(await readFile(path, { encoding: 'utf-8' }))
        } catch (error) {
            return {}
        }
    }

    private async removeKey(key: string): Promise<void> {
        const keys = await this.keys()
        delete keys[key]
        await this.saveKeys(keys)
    }

    private async storeKey(key: string): Promise<void> {
        const keys = await this.keys()
        keys[key] = this.hashKey(key)
        await this.saveKeys(keys)
    }

    private async saveKeys(keys: Record<string, string>): Promise<void> {
        await writeFile(`${this.keysDirectory}/keys`, JSON.stringify(keys))
    }

    private path(key: string): string {
        return `${this.directory}/${this.hashKey(key)}`
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha1').update(key).digest('base64')
    }
}

export default File
