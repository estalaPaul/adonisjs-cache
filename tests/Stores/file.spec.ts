import { test } from '@japa/runner'
import FileStore from '../../src/Stores/File'
import { cleanCacheEntries } from '../../test-helpers'

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
