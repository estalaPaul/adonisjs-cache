import { RedisClusterConnectionContract, RedisConnectionContract } from '@ioc:Adonis/Addons/Redis'
import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'

class Redis implements CacheStoreInterface {
    private connection: RedisConnectionContract | RedisClusterConnectionContract

    constructor(redis: RedisConnectionContract | RedisClusterConnectionContract) {
        this.connection = redis
    }

    public async has(key: string): Promise<boolean> {
        return await this.connection.exists(key) > 0
    }

    public async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.connection.get(key)

            if (data === null) {
                return null
            }

            return JSON.parse(data)
        } catch (error) {
            return null
        }
    }

    public async add(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<boolean> {
        if (await this.has(key)) {
            return false
        }

        await this.set(key, data, duration)
        return true
    }

    public async set<T>(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<T> {
        if (duration === null) {
            await this.connection.set(key, JSON.stringify(data))
            return data
        }

        await this.connection.setex(key, duration, JSON.stringify(data))
        return data
    }

    public async remember<T>(
        key: string,
        callback: Function,
        duration: number | null = null
    ): Promise<T | null> {}

    public async delete(key: string): Promise<boolean> {}

    public async flush(): Promise<boolean> {
        try {
            await rm(`${this.directory}`, { recursive: true })
            await mkdir(this.directory)
            await rm(`${this.keysDirectory}/keys`)
            return true
        } catch (error) {
            return false
        }
    }

    public async keys(): Promise<string[]> {
        const path = `${this.keysDirectory}/keys`
        try {
            return JSON.parse(await readFile(path, { encoding: 'utf-8' }))
        } catch (error) {
            return []
        }
    }

    private async removeKey(key: string): Promise<void> {
        const keys = await this.keys()

        let index = keys.indexOf(key)
        if (index !== -1) {
            keys.splice(index, 1)
        }

        await this.saveKeys(keys)
    }

    private async storeKey(key: string): Promise<void> {
        const keys = await this.keys()

        let index = keys.indexOf(key)
        if (index === -1) {
            keys.push(key)
        }

        await this.saveKeys(keys)
    }

    private async saveKeys(keys: string[]): Promise<void> {
        await writeFile(`${this.keysDirectory}/keys`, JSON.stringify(keys))
    }

    private path(key: string): string {
        return `${this.directory}/${this.hashKey(key)}`
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha1').update(key).digest('hex')
    }
}

export default Redis    }
}

export default Redis
