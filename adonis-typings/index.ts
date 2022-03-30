declare module '@ioc:EstalaPaul/AdonisJSCache' {
    import { ConfigContract } from '@ioc:Adonis/Core/Config'

    export type CacheDrivers = 'file'

    export interface CacheConfig {
        default: CacheDrivers
        stores: {
            'file': {
                'driver': 'file',
                'path': string
            }
        }
    }

    export interface CacheManagerInterface {
        constructor(config: ConfigContract): void
        get(key: string): Promise<any>
        set(key: string, data: any, duration: number): Promise<any>
        delete(key: string): Promise<Boolean>
    }

    export interface CacheStoreInterface {
        get(key: string): Promise<any>
        set(key: string, data: any, duration: number): Promise<any>
        delete(key: string): Promise<Boolean>
    }

    const Cache: CacheManagerInterface

    export default Cache
}
