import * as path from 'path'
import { existsSync } from 'fs'
const  printAndExit = require('next/dist/server/lib/utils').printAndExit
//

export default async function validate (currentPath: string, config: any) {
  const pagesDir = path.join(currentPath, config.dir, 'pages')

  // Check for '/pages' directory'
  if (!existsSync(pagesDir)) {
    if (existsSync(path.join(pagesDir, '..', 'pages'))) {
      printAndExit(`> No '/pages' directory found. Are you sure you\'re in the correct directory?`)
    } 

    printAndExit(`> No '/pages' directory found in '${config.dir}'. Please create one to continue.`)
  }
}

