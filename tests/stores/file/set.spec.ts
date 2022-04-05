import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'
import FakeTimers from '@sinonjs/fake-timers'
import { cleanCacheEntries } from '../../../test-helpers'

test('can save cache entry forever', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }

    await fileStore.set('random', data)

    expect(await fileStore.get('random')).toEqual(data)
    await cleanCacheEntries(['random'], fileStore)
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

test('keys are stored correctly', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar' })
    await fileStore.set('random2', { ping: 'pong' })
    await fileStore.set('random3', { ping: 'pong' })

    const keys = await fileStore.keys()

    expect(Object.keys(keys)).toHaveLength(3)
    expect(Object.keys(keys)).toContain('random')
    expect(Object.keys(keys)).toContain('random2')
    expect(Object.keys(keys)).toContain('random3')
    await cleanCacheEntries(['random', 'random2', 'random3'], fileStore)
})

test('keys are deleted correctly', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar' })
    await fileStore.set('random2', { ping: 'pong' })
    await fileStore.delete('random')

    const keys = await fileStore.keys()

    expect(Object.keys(keys)).toHaveLength(1)
    expect(Object.keys(keys)).toContain('random2')
    await cleanCacheEntries(['random2'], fileStore)
})
