import { test } from '@japa/runner'
import { rm, writeFile, access } from 'fs/promises'
import FileStore from '../../../src/Stores/File'
import FakeTimers from '@sinonjs/fake-timers'
import crypto from 'crypto'

test('get file store with missing directory', async ({ expect }) => {
    new FileStore('./.tmp/testing-missing-dir/')

    expect(
        async () => await access('./.tmp/testing-missing-dir/')
    ).not.toThrow()
})

test('get invalid cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const path = `./.tmp/cache/${crypto
        .createHash('sha1')
        .update('random')
        .digest('hex')}`
    await writeFile(path, JSON.stringify({ test: 'testing' }))

    const getResult = await fileStore.get('random')

    expect(getResult).toBeNull()
    await rm(path)
})

test('can get non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    expect(await fileStore.get('random')).toBeNull()
})

test('can get non expired cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }
    const currentTime = new Date().getTime()
    await fileStore.set('random', data, 30)
    const clock = FakeTimers.install({ now: currentTime + 20000 })

    const getResult = await fileStore.get('random')

    expect(getResult).toEqual(data)
    clock.uninstall()
})
