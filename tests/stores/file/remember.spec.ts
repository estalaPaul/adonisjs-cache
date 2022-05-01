import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'
import FakeTimers from '@sinonjs/fake-timers'
import { cleanCacheEntries } from '../../../test-helpers'

test('remember returns existing cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }
    await fileStore.set('random', data)

    await fileStore.remember('random', () => {
        return { dummy: 'data' }
    })

    expect(await fileStore.get('random')).toEqual(data)
    await cleanCacheEntries(['random'], fileStore)
})

test('remember saves data if no cache entry exists', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { dummy: 'data' }

    await fileStore.remember('random', () => {
        return data
    })

    expect(await fileStore.get('random')).toEqual(data)
    await cleanCacheEntries(['random'], fileStore)
})

test('remember saves data if entry is expired', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { testing: 'testing' }, 30)
    const data = { foo: 'bar', ping: 'pong' }
    const currentTime = new Date().getTime()

    const clock = FakeTimers.install({ now: currentTime + 40000 })

    await fileStore.remember('random', () => {
        return data
    })

    expect(await fileStore.get('random')).toEqual(data)
    await cleanCacheEntries(['random'], fileStore)
    clock.uninstall()
})
