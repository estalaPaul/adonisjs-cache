declare module '@ioc:EstalaPaul/AdonisJSCache' {
    import { ConfigContract } from '@ioc:Adonis/Core/Config'

    export type CacheDrivers = 'file' | 'redis'

    export interface CacheConfig {
        driver: CacheDrivers
        stores: {
            file: {
                driver: 'file'
                path: string
            }
            redis: {
                connection: string
            }
        }
    }

    export interface CacheManagerInterface {
        constructor(config: ConfigContract): void
        has(key: string): Promise<boolean>
        get<T>(key: string): Promise<T | null>
        add(key: string, data: any, duration?: number | null): Promise<boolean>
        set<T>(key: string, data: any, duration?: number | null): Promise<T>
        remember<T>(
            key: string,
            callback: Function,
            duration?: number | null
        ): Promise<T | null>
        delete(key: string): Promise<boolean>
        flush(): Promise<boolean>
        keys(): Promise<string[]>
    }

    export interface CacheStoreInterface {
        has(key: string): Promise<boolean>
        get<T>(key: string): Promise<T | null>
        add(key: string, data: any, duration?: number | null): Promise<boolean>
        set<T>(key: string, data: any, duration?: number | null): Promise<T>
        remember<T>(
            key: string,
            callback: Function,
            duration?: number | null
        ): Promise<T | null>
        delete(key: string): Promise<boolean>
        flush(): Promise<boolean>
        keys(): Promise<string[]>
    }

    const Cache: CacheManagerInterface

    export default Cache
}
