import CacheManager from '../../src/CacheManager'
import FileStore from '../../src/Stores/File'
import { destroyApplication, setUpApplication } from '../../test-helpers'

import crypto from 'crypto'
import { rm, writeFile } from 'fs/promises'
import { join } from 'path'

import FakeTimers from '@sinonjs/fake-timers'
import { Application } from '@adonisjs/core/build/standalone'
import { Filesystem } from '@poppinss/dev-utils'
import { test } from '@japa/runner'

test.group('Cache with file driver', (group) => {
    const fs = new Filesystem(join(__dirname, '..', '.tmp'))
    let cache: CacheManager
    let app: Application

    group.setup(async () => {
        app = await setUpApplication('file', fs)
        cache = new CacheManager(app)
    })

    group.teardown(async () => {
        await destroyApplication(app, fs)
    })

    group.each.setup(async () => {
        await cache.flush()
    })

    test('has detects existing entry', async ({ expect }) => {
        await cache.set('random', { foo: 'bar', ping: 'pong' })

        const has = await cache.has('random')

        expect(has).toBeTruthy()
    })

    test('has detects non existent entry', async ({ expect }) => {
        const has = await cache.has('random')

        expect(has).toBeFalsy()
    })

    test('has detects expired entry', async ({ expect }) => {
        const data = { foo: 'bar', ping: 'pong' }
        await cache.set('random', data, 30)
        const currentTime = new Date().getTime()
        const clock = FakeTimers.install({ now: currentTime + 40000 })

        const has = await cache.has('random')

        expect(has).toBeFalsy()
        clock.uninstall()
    })

    test('get invalid entry does not return it', async ({ expect }) => {
        const fileStore = new FileStore(join(__dirname, '..', '.tmp'))
        const path = join(
            __dirname,
            '..',
            '.tmp',
            'cache',
            crypto.createHash('sha1').update('random').digest('hex')
        )
        await writeFile(path, JSON.stringify({ test: 'testing' }))

        const getResult = await fileStore.get('random')

        expect(getResult).toBeNull()
        await rm(path)
    })

    test('can get non existent entry', async ({ expect }) => {
        expect(await cache.get('random')).toBeNull()
    })

    test('can get non expired entry', async ({ expect }) => {
        const data = { foo: 'bar', ping: 'pong' }
        const currentTime = new Date().getTime()
        await cache.set('random', data, 30)
        const clock = FakeTimers.install({ now: currentTime + 20000 })

        const getResult = await cache.get('random')

        expect(getResult).toEqual(data)
        clock.uninstall()
    })

    test('add creates non existent entry', async ({ expect }) => {
        const data = { foo: 'bar' }

        await cache.add('random', data)
        expect(await cache.get('random')).toEqual(data)
    })

    test('add does not overwrite existing entry', async ({ expect }) => {
        const data = { foo: 'bar' }
        await cache.set('random', data)

        await cache.add('random', { ping: 'pong' })

        expect(await cache.get('random')).toEqual(data)
    })

    test('can set entry forever', async ({ expect }) => {
        const data = { foo: 'bar', ping: 'pong' }

        await cache.set('products', data)

        expect(await cache.get('products')).toEqual(data)
    })

    test('can set entry for certain time', async ({ expect }) => {
        const data = { foo: 'bar', ping: 'pong' }
        const currentTime = new Date().getTime()

        await cache.set('random', data, 30)

        const clock = FakeTimers.install({ now: currentTime + 40000 })
        expect(await cache.get('random')).toBeNull()
        clock.uninstall()
    })

    test('remember returns existing entry', async ({ expect }) => {
        const data = { foo: 'bar', ping: 'pong' }
        await cache.set('random', data)

        await cache.remember('random', () => {
            return { dummy: 'data' }
        })

        expect(await cache.get('random')).toEqual(data)
    })

    test('remember saves data if no entry exists', async ({ expect }) => {
        const data = { dummy: 'data' }

        await cache.remember('random', () => {
            return data
        })

        expect(await cache.get('random')).toEqual(data)
    })

    test('remember saves data if entry is expired', async ({ expect }) => {
        await cache.set('random', { testing: 'testing' }, 30)
        const data = { foo: 'bar', ping: 'pong' }
        const currentTime = new Date().getTime()

        const clock = FakeTimers.install({ now: currentTime + 40000 })

        await cache.remember('random', () => {
            return data
        })

        expect(await cache.get('random')).toEqual(data)
        clock.uninstall()
    })

    test('can delete entry', async ({ expect }) => {
        await cache.set('random', { foo: 'bar', ping: 'pong' })

        await cache.delete('random')

        expect(await cache.get('random')).toBeNull()
    })

    test('can delete non existent entry', async ({ expect }) => {
        const deleted = await cache.delete('random')

        expect(deleted).toBeFalsy()
    })

    test('can flush entries', async ({ expect }) => {
        await cache.set('random', { foo: 'bar', ping: 'pong' })
        await cache.set('random2', { foo: 'bar', ping: 'pong' })
        await cache.set('random3', { foo: 'bar', ping: 'pong' })

        const flushed = await cache.flush()

        expect(flushed).toBeTruthy()
        expect(await cache.keys()).toEqual([])
    })

    test('flush fails gracefully', async ({ expect }) => {
        const fileStore = new FileStore(join(__dirname, '..', '.tmp'))
        await rm(join(__dirname, '..', '.tmp', 'cache'), { recursive: true })

        const flushed = await fileStore.flush()

        expect(flushed).toBeFalsy()
    })

    test('keys are stored correctly', async ({ expect }) => {
        await cache.set('random', { foo: 'bar' })
        await cache.set('random2', { ping: 'pong' })
        await cache.set('random3', { ping: 'pong' })

        const keys = await cache.keys()

        expect(keys).toHaveLength(3)
        expect(keys).toContain('random')
        expect(keys).toContain('random2')
        expect(keys).toContain('random3')
    })

    test('keys are deleted correctly', async ({ expect }) => {
        await cache.set('random', { foo: 'bar' })
        await cache.set('random2', { ping: 'pong' })
        await cache.delete('random')

        const keys = await cache.keys()

        expect(keys).toHaveLength(1)
        expect(keys).toContain('random2')
    })
})
