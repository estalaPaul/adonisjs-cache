import { test } from '@japa/runner'
import { rm, writeFile } from 'fs/promises'
import FileStore from '../../../src/Stores/File'
import crypto from 'crypto'

test('get invalid cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    const path = `./.tmp/cache/${crypto
        .createHash('sha1')
        .update('random')
        .digest('base64')}`
    await writeFile(path, JSON.stringify({ test: 'testing' }))

    expect(await fileStore.get('random')).toBeNull()
    await rm(path)
})

test('can get non existent cache entry', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')

    expect(await fileStore.get('random')).toBeNull()
})
