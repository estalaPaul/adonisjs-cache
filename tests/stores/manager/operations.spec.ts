import { test } from '@japa/runner'
import { app } from '../../../bin/test'
import CacheManager from '../../../src/CacheManager'

test('can add with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)

    const result = await manager.add('testing', 'testing')

    expect(result).toBeTruthy()
})

test('can delete with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)

    const result = await manager.delete('testing')

    expect(result).toBeTruthy()
})

test('can get with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)

    const result = await manager.get('testing')

    expect(result).toBeNull()
})

test('can flush with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)

    const result = await manager.flush()

    expect(result).toBeTruthy()
})

test('can use has with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)

    const result = await manager.has('testing')

    expect(result).toBeFalsy()
})

test('can get keys with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)

    const result = await manager.keys()

    expect(result).toEqual({})
})

test('can remember with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)
    const data = 'testing'

    const result = await manager.remember('testing', () => data)

    expect(result).toEqual(data)
})

test('can set with cache manager', async ({ expect }) => {
    const manager = new CacheManager(app)
    const data = 'testing'

    const result = await manager.set('testing', data)

    expect(result).toEqual(data)
})
