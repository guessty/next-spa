import * as path from 'path'
import exportNextApp from 'next/dist/export'
//

export default async function exportApp (currentPath, config) {
  const appPath = path.join(currentPath, config.dir)
  const publicDistPath = path.join(appPath, config.distDir, '..', 'export')
  await exportNextApp(appPath, { outdir: publicDistPath }, config)
  console.log('|- exported static pages!')
}