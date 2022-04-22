import { expect } from '@japa/expect'
import { specReporter } from '@japa/spec-reporter'
import { processCliArgs, configure, run } from '@japa/runner'

import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Application } from '@adonisjs/core/build/standalone'

export const fs = new Filesystem(join(__dirname, '..', '.tmp'))
export let app: Application

/**
 * Setup application
 */
export async function setupApplication() {
    await fs.add('.env', '')
    await fs.add('.adonisrc.json', '{}')
    await fs.add('config/app.ts', "export const appKey = 'some-random-app-key'")
    await fs.add(
        'config/cache.ts',
        `export const driver = 'file'
         export const stores = {
            file: {
                driver: 'file',
                path: './testing-cache-manager'
            }
        }`
    )

    app = new Application(fs.basePath, 'test')

    app.setup()
    app.registerProviders()
    await app.bootProviders()
}

export async function teardownApplication() {
    await app.shutdown()
    await fs.cleanup()
}

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
    ...processCliArgs(process.argv.slice(2)),
    ...{
        files: ['tests/**/*.spec.ts'],
        plugins: [expect()],
        reporters: [specReporter()],
        importer: (filePath) => import(filePath),
        setup: [setupApplication],
        teardown: [teardownApplication],
    },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
