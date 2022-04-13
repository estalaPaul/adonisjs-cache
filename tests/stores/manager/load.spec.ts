import { test } from '@japa/runner'
import { access } from 'fs/promises'
import { app } from '../../../bin/test'
import CacheManager from '../../../src/CacheManager'

test('can load cache manager with file store', async ({ expect }) => {
    new CacheManager(app)
    expect(
        async () => await access('./.tmp/testing-cache-manager')
    ).not.toThrow()
})
