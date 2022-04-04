import { test } from '@japa/runner'
import FileStore from '../../src/Stores/File'
import { cleanCacheEntries } from '../../test-helpers'
import FakeTimers from '@sinonjs/fake-timers'

test('can get non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    expect(await fileStore.get('random')).toBeNull()
})

test('can save cache entry forever', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }

    await fileStore.set('random', data)

    expect(await fileStore.get('random')).toEqual(data)
    cleanCacheEntries(['random'], fileStore)
})

test('can save cache entry for certain time', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }
    const currentTime = new Date().getTime()

    await fileStore.set('random', data, 30)

    const clock = FakeTimers.install({now: currentTime + 40})
    expect(await fileStore.get('random')).toBeNull()
    clock.uninstall()
})

test('can delete cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar', ping: 'pong' })

    await fileStore.delete('random')

    expect(await fileStore.get('random')).toBeNull()
})

test('can add cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.add('random', { foo: 'bar', ping: 'pong' })

    const deleted = await fileStore.delete('random')

    expect (deleted).toBeTruthy()
    expect(await fileStore.get('random')).toBeNull()
})

test('add does not overwrite existing entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }
    await fileStore.set('random', data)

    const added = await fileStore.add('random', { foo: 'bar' })

    expect(await fileStore.get('random')).toEqual(data)
    expect(added).toBeFalsy()
    cleanCacheEntries(['random'], fileStore)
})
