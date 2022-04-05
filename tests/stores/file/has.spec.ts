import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'
import { cleanCacheEntries } from '../../../test-helpers'

test('has detects existing cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar', ping: 'pong' })

    const has = await fileStore.has('random')

    expect(has).toBeTruthy()
    cleanCacheEntries(['random'], fileStore)
})

test('has detects non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    const has = await fileStore.has('random')

    expect(has).toBeFalsy()
})
