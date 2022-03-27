import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'

class FileStore implements CacheStoreInterface {
	public async get(name: string): Promise<any> {
        // TODO
	}

	public async set(name: string, data: any, duration: number = 0): Promise<any> {
        // TODO
	}

	public async delete(name: string): Promise<Boolean> {
        // TODO
	}
}

export default FileStore
