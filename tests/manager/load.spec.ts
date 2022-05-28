import { Application } from '@adonisjs/core/build/standalone'
import { test } from '@japa/runner'
import { Filesystem } from '@poppinss/dev-utils'
import { join } from 'path'
import CacheManager from '../../src/CacheManager'

test('can not load cache manager without config', async ({ expect }) => {
    const faultyFs = new Filesystem(join(__dirname, '..', '.tmp/faulty'))
    await faultyFs.add('.env', '')
    await faultyFs.add('.adonisrc.json', '{}')
    await faultyFs.add(
        'config/app.ts',
        "export const appKey = 'some-random-app-key'"
    )
    await faultyFs.add('config/cache.ts', `export const driver = 'file'`)
    const faultyApp = new Application(faultyFs.basePath, 'test')
    faultyApp.setup()
    faultyApp.registerProviders()
    await faultyApp.bootProviders()

    expect(() => new CacheManager(faultyApp)).toThrow(
        'No driver config found for file.'
    )

    await faultyApp.shutdown()
    await faultyFs.cleanup()
})
