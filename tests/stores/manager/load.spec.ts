import { Application } from '@adonisjs/core/build/standalone'
import { test } from '@japa/runner'
import { Filesystem } from '@poppinss/dev-utils'
import { access } from 'fs/promises'
import { join } from 'path'
import { app } from '../../../bin/test'
import CacheManager from '../../../src/CacheManager'

test('can not load cache manager without config', async ({ expect }) => {
    const fs = new Filesystem(join(__dirname, '..', '.tmp/faulty'))
    await fs.add('.env', '')
    await fs.add('.adonisrc.json', '{}')
    await fs.add('config/app.ts', "export const appKey = 'some-random-app-key'")
    await fs.add('config/cache.ts', `export const driver = 'file'`)
    const faultyApp = new Application(fs.basePath, 'test')
    faultyApp.setup()
    faultyApp.registerProviders()
    await faultyApp.bootProviders()

    expect(() => new CacheManager(faultyApp)).toThrow(
        'No driver config found for file.'
    )

    await faultyApp.shutdown()
})

test('can load cache manager with file store', async ({ expect }) => {
    new CacheManager(app)

    expect(
        async () => await access('./.tmp/testing-cache-manager')
    ).not.toThrow()
})
