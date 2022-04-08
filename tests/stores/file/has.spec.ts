import { test } from '@japa/runner'
import { cleanCacheEntries } from '../../../test-helpers'
import FileStore from '../../../src/Stores/File'
import FakeTimers from '@sinonjs/fake-timers'

test('has detects existing cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar', ping: 'pong' })

    const has = await fileStore.has('random')

    expect(has).toBeTruthy()
    await cleanCacheEntries(['random'], fileStore)
})

test('has detects non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    const has = await fileStore.has('random')

    expect(has).toBeFalsy()
})

test('has detects expired cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }
    await fileStore.set('random', data, 30)
    const currentTime = new Date().getTime()
    const clock = FakeTimers.install({ now: currentTime + 40 })

    const has = await fileStore.has('random')

    expect(has).toBeFalsy()
    await cleanCacheEntries(['random'], fileStore)
    clock.uninstall()
})
