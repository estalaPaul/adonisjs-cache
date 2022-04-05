import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'

test('can delete cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar', ping: 'pong' })

    await fileStore.delete('random')

    expect(await fileStore.get('random')).toBeNull()
})

test('can delete non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    const deleted = await fileStore.delete('random')

    expect(deleted).toBeFalsy()
})
