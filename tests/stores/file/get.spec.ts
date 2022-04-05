import { test } from '@japa/runner'
import FileStore from '../../../src/Stores/File'

test('can get non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    expect(await fileStore.get('random')).toBeNull()
})
