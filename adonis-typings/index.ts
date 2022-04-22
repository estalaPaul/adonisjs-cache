declare module '@ioc:EstalaPaul/AdonisJSCache' {
    import { ConfigContract } from '@ioc:Adonis/Core/Config'

    export type CacheDrivers = 'file'

    export interface CacheConfig {
        default: CacheDrivers
        stores: {
            file: {
                driver: 'file'
                path: string
            }
        }
    }

    export interface CacheManagerInterface {
        constructor(config: ConfigContract): void
        has(key: string): Promise<boolean>
        get(key: string): Promise<any>
        add(key: string, data: any, duration: number | null): Promise<boolean>
        set(key: string, data: any, duration: number | null): Promise<any>
        remember(
            key: string,
            callback: Function,
            duration: number | null
        ): Promise<boolean>
        delete(key: string): Promise<boolean>
        flush(): Promise<boolean>
        keys(): Promise<Record<string, string>>
    }

    export interface CacheStoreInterface {
        has(key: string): Promise<boolean>
        get(key: string): Promise<any>
        add(key: string, data: any, duration: number | null): Promise<boolean>
        set(key: string, data: any, duration: number | null): Promise<any>
        remember(
            key: string,
            callback: Function,
            duration: number | null
        ): Promise<boolean>
        delete(key: string): Promise<boolean>
        flush(): Promise<boolean>
        keys(): Promise<Record<string, string>>
    }

    const Cache: CacheManagerInterface

    export default Cache
}
