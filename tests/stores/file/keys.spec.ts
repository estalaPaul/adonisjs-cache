import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'
import { cleanCacheEntries } from '../../../test-helpers'

test('keys are stored correctly', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar' })
    await fileStore.set('random2', { ping: 'pong' })
    await fileStore.set('random3', { ping: 'pong' })

    const keys = await fileStore.keys()

    expect(keys).toHaveLength(3)
    expect(keys).toContain('random')
    expect(keys).toContain('random2')
    expect(keys).toContain('random3')
    await cleanCacheEntries(['random', 'random2', 'random3'], fileStore)
})

test('keys are deleted correctly', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar' })
    await fileStore.set('random2', { ping: 'pong' })
    await fileStore.delete('random')

    const keys = await fileStore.keys()

    expect(keys).toHaveLength(1)
    expect(keys).toContain('random2')
    await cleanCacheEntries(['random2'], fileStore)
})
