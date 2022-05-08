import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'
import FakeTimers from '@sinonjs/fake-timers'
import { cleanCacheEntries } from '../../../test-helpers'

test('can save cache entry forever', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }

    await fileStore.set('products', data)

    expect(await fileStore.get('products')).toEqual(data)
    await cleanCacheEntries(['products'], fileStore)
})

test('can save cache entry for certain time', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar', ping: 'pong' }
    const currentTime = new Date().getTime()

    await fileStore.set('random', data, 30)

    const clock = FakeTimers.install({ now: currentTime + 40000 })
    expect(await fileStore.get('random')).toBeNull()
    clock.uninstall()
})
