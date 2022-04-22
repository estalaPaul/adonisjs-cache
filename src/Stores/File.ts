import { CacheStoreInterface } from '@ioc:EstalaPaul/AdonisJSCache'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm, mkdir } from 'fs/promises'
import crypto from 'crypto'

class File implements CacheStoreInterface {
    private directory: string

    private keysDirectory: string

    constructor(directoryPath: string) {
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, { recursive: true })
        }

        const directory = `${directoryPath}/cache`
        if (!existsSync(directory)) {
            mkdirSync(directory)
        }

        const keysDirectory = `${directoryPath}/keys`
        if (!existsSync(keysDirectory)) {
            mkdirSync(keysDirectory)
        }

        this.directory = directory
        this.keysDirectory = keysDirectory
    }

    public async has(key: string): Promise<boolean> {
        return (await this.get(key)) !== null
    }

    public async get(key: string): Promise<any> {
        try {
            const contents = JSON.parse(
                await readFile(this.path(key), { encoding: 'utf-8' })
            )

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

    public async add(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<boolean> {
        if (await this.has(key)) {
            return false
        }

        await this.set(key, data, duration)
        await this.storeKey(key)
        return true
    }

    public async set(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<any> {
        const contents = {
            data: data,
            time: duration !== null ? new Date().getTime() + duration : null,
        }

        await writeFile(this.path(key), JSON.stringify(contents))
        await this.storeKey(key)
        return contents.data
    }

    public async remember(
        key: string,
        callback: Function,
        duration: number | null = null
    ): Promise<any> {
        if (await this.has(key)) {
            return await this.get(key)
        }

        return await this.set(key, await callback(), duration)
    }

    public async delete(key: string): Promise<boolean> {
        try {
            await rm(this.path(key))
            await this.removeKey(key)
            return true
        } catch (error) {
            return false
        }
    }

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

    public async keys(): Promise<Record<string, string>> {
        const path = `${this.keysDirectory}/keys`
        try {
            return JSON.parse(await readFile(path, { encoding: 'utf-8' }))
        } catch (error) {
            return {}
        }
    }

    private async removeKey(key: string): Promise<void> {
        const keys = await this.keys()
        delete keys[key]
        await this.saveKeys(keys)
    }

    private async storeKey(key: string): Promise<void> {
        const keys = await this.keys()
        keys[key] = this.hashKey(key)
        await this.saveKeys(keys)
    }

    private async saveKeys(keys: Record<string, string>): Promise<void> {
        await writeFile(`${this.keysDirectory}/keys`, JSON.stringify(keys))
    }

    private path(key: string): string {
        return `${this.directory}/${this.hashKey(key)}`
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha1').update(key).digest('base64')
    }
}

export default File
