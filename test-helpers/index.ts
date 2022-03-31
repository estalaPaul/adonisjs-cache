import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'

export async function cleanCacheEntries(keys: string[], store: CacheStoreInterface) {
    for (const key of keys) {
        await store.delete(key)
    }
}
