import * as path from 'path'
import build from 'next/dist/build'
//

export default async function buildApp (currentPath, config) {
  const appPath = path.join(currentPath, config.dir)
  await build(appPath, config)
  console.log('|- built app!')
}