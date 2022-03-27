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
        get(name: string): Promise<any>
        set(name: string, data: any, duration: number): Promise<any>
        delete(name: string): Promise<Boolean>
    }

    export interface CacheStoreInterface {
        get(name: string): Promise<any>
        set(name: string, data: any, duration: number): Promise<any>
        delete(name: string): Promise<Boolean>
    }

    const Cache: CacheManagerInterface

    export default Cache
}
