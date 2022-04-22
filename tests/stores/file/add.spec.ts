import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'
import { cleanCacheEntries } from '../../../test-helpers'

test('add creates nonexistent entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar' }

    await fileStore.add('random', data)

    expect(await fileStore.get('random')).toEqual(data)
    await cleanCacheEntries(['random'], fileStore)
})

test('add does not overwrite existing entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const data = { foo: 'bar' }
    await fileStore.set('random', data)

    await fileStore.add('random', { ping: 'pong' })

    expect(await fileStore.get('random')).toEqual(data)
    await cleanCacheEntries(['random'], fileStore)
})
