jest.setTimeout(60 * 10 * 1000)

const path = require('path')
const { create } = require('./helper')

test.skip('build for javascript project', async () => {
  const projectName = 'vue-i18n-build-javascript'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    }
  })
  expect(project.has('src/index.js')).toBe(true)

  const targetService = path.join(
    project.dir,
    './node_modules/@vue/cli-service/bin/vue-cli-service.js'
  )
  await project.run(`${targetService} build`)
  const distFiles = [
    `dist/${projectName}.common.js`,
    `dist/${projectName}.umd.min.js`,
    `dist/${projectName}.umd.js`,
    `dist/${projectName}.esm.js`
  ]
  distFiles.forEach(file => { expect(project.has(file)).toBe(true) })

  const pkg = JSON.parse(await project.read('package.json') )
  expect(pkg.private).toBeUndefined()
  expect(pkg.dependencies['vue']).toBeUndefined()
  expect(pkg.devDependencies['vue']).not.toBeUndefined()
})

test('build for typescript project', async () => {
  const projectName = 'vue-i18n-build-typescript'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      '@vue/cli-plugin-typescript': {
        classComponent: true 
      }
    }
  })
  expect(project.has('src/index.ts')).toBe(true)
  expect(project.has('types/index.d.ts')).toBe(true)

  const targetService = path.join(
    project.dir,
    './node_modules/@vue/cli-service/bin/vue-cli-service.js'
  )
  await project.run(`${targetService} build`)
  const distFiles = [
    `dist/${projectName}.common.js`,
    `dist/${projectName}.umd.min.js`,
    `dist/${projectName}.umd.js`,
    `dist/${projectName}.esm.js`
  ]
  distFiles.forEach(file => { expect(project.has(file)).toBe(true) })

  const pkg = JSON.parse(await project.read('package.json') )
  expect(pkg.private).toBeUndefined()
  expect(pkg.dependencies['vue']).toBeUndefined()
  expect(pkg.devDependencies['vue']).not.toBeUndefined()
  expect(pkg.dependencies['vue-class-component']).toBeUndefined()
  expect(pkg.devDependencies['vue-class-component']).not.toBeUndefined()
  expect(pkg.dependencies['vue-property-decorator']).toBeUndefined()
  expect(pkg.devDependencies['vue-property-decorator']).not.toBeUndefined()
})