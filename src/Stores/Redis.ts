import {
    RedisClusterConnectionContract,
    RedisConnectionContract,
} from '@ioc:Adonis/Addons/Redis'
import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'

class Redis implements CacheStoreInterface {
    private connection: RedisConnectionContract | RedisClusterConnectionContract

    constructor(
        redis: RedisConnectionContract | RedisClusterConnectionContract
    ) {
        this.connection = redis
    }

    public async has(key: string): Promise<boolean> {
        return (await this.connection.exists(key)) > 0
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
    ): Promise<T | null> {
        if (await this.has(key)) {
            return await this.get(key)
        }

        return await this.set(key, await callback(), duration)
    }

    public async delete(key: string): Promise<boolean> {
        return (await this.connection.del(key)) > 0
    }

    public async flush(): Promise<boolean> {
        await this.connection.flushdb()
        return true
    }

    public async keys(): Promise<string[]> {
        return await this.connection.keys('*')
    }
}

export default Redis
