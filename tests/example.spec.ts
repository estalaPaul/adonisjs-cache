import { test } from '@japa/runner'

function sum(a, b) {
    return a + b
}

test('add two numbers', ({ expect }) => {
    expect(sum(2, 2)).toEqual(4)
})


