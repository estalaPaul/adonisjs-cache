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

    public async get<T>(key: string): Promise<T> {
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

    public async set<T>(
        key: string,
        data: any,
        duration: number | null = null
    ): Promise<T> {
        const contents = {
            data: data,
            time:
                duration !== null
                    ? new Date().getTime() + duration * 1000
                    : null,
        }

        await writeFile(this.path(key), JSON.stringify(contents))
        await this.storeKey(key)
        return contents.data
    }

    public async remember<T>(
        key: string,
        callback: Function,
        duration: number | null = null
    ): Promise<T> {
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

    public async keys(): Promise<string[]> {
        const path = `${this.keysDirectory}/keys`
        try {
            return JSON.parse(await readFile(path, { encoding: 'utf-8' }))
        } catch (error) {
            return []
        }
    }

    private async removeKey(key: string): Promise<void> {
        const keys = await this.keys()

        let index = keys.indexOf(key)
        if (index !== -1) {
            keys.splice(index, 1)
        }

        await this.saveKeys(keys)
    }

    private async storeKey(key: string): Promise<void> {
        const keys = await this.keys()

        let index = keys.indexOf(key)
        if (index === -1) {
            keys.push(key)
        }

        await this.saveKeys(keys)
    }

    private async saveKeys(keys: string[]): Promise<void> {
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
