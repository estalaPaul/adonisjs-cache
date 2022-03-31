import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, unlink } from 'fs/promises'
import crypto from 'crypto'

class File implements CacheStoreInterface {
    private directory: string

    constructor(directoryPath: string) {
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, { recursive: true })
        }

        this.directory = directoryPath
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

	public async set(key: string, data: any, duration: number | null = null): Promise<any> {
        const contents = {
            data: data,
            time: duration
        }

        await writeFile(this.path(key), JSON.stringify(contents))
        return contents
	}

	public async delete(key: string): Promise<Boolean> {
        try {
            await unlink(this.path(key))
            return true
        } catch (error) {
            return false
        }
	}

    private path(key: string): string {
        return `${this.directory}/${crypto.createHash('sha1').update(key).digest('base64')}`
    }
}

export default File
