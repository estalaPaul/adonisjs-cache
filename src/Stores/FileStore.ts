import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'
import { HashContract } from '@ioc:Adonis/Core/Hash'
import { existsSync, mkdirSync } from 'fs'
import { readFile } from 'fs/promises'

class FileStore implements CacheStoreInterface {
    private directory: string

    private hash: HashContract

    constructor(hash: HashContract, directoryPath: string) {
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, { recursive: true })
        }

        this.directory = directoryPath
        this.hash = hash
    }

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

	public async set(key: string, data: any, duration: number = 0): Promise<any> {
        // TODO
	}

	public async delete(key: string): Promise<Boolean> {
        // TODO
        return false
	}

    private path(key: string): string {
        return `${this.directory}/${this.hash.hash(key)}`
    }
}

export default FileStore
