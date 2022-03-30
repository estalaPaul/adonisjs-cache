import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import FileStore from '../../src/Stores/File'

test('get cache entry', ({ expect }) => {
    const fileStore = new FileStore(Hash, './')
})


