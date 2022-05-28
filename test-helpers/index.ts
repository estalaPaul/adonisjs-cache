import { Application } from '@adonisjs/core/build/standalone'
import { CacheDrivers } from '@ioc:EstalaPaul/AdonisJSCache'
import { Filesystem } from '@poppinss/dev-utils'

export async function setUpApplication(
    cacheDriver: CacheDrivers,
    fs: Filesystem
): Promise<Application> {
    await fs.add('.env', '')
    await fs.add('.adonisrc.json', '{}')
    await fs.add('config/app.ts', "export const appKey = 'some-random-app-key'")
    await fs.add(
        'config/cache.ts',
        `export const driver = '${cacheDriver}'
         export const stores = {
            file: {
                driver: 'file',
                path: './testing-cache-manager'
            }
        }`
    )

    const app = new Application(fs.basePath, 'test')

    app.setup()
    app.registerProviders()
    await app.bootProviders()

    return app
}

export async function destroyApplication(app: Application, fs: Filesystem) {
    await app.shutdown()
    await fs.cleanup()
}
