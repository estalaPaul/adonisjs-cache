import { test } from '@japa/runner'
import { rm } from 'fs/promises'
import FileStore from '../../../src/Stores/File'

test('can flush cache entries', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await fileStore.set('random', { foo: 'bar', ping: 'pong' })
    await fileStore.set('random2', { foo: 'bar', ping: 'pong' })
    await fileStore.set('random3', { foo: 'bar', ping: 'pong' })

    const flushed = await fileStore.flush()

    expect(flushed).toBeTruthy()
    expect(await fileStore.keys()).toEqual([])
})

test('flush fails gracefully', async ({ expect }) => {
    const fileStore = new FileStore('./.tmp')
    await rm('./.tmp/cache', { recursive: true })

    const flushed = await fileStore.flush()

    expect(flushed).toBeFalsy()
})
