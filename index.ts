import { getInput, setFailed } from '@actions/core'
import { mkdirSync, writeFileSync } from 'fs'
import { context } from '@actions/github'
import { execSync } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'

try {
  let exec = (command: string) => {
    console.log('exec', command.length, command)
    let result = execSync(command, { encoding: 'utf-8' })
    console.log(result)
  }

  const NAME = getInput('NAME')
  const PORT = getInput('PORT')
  const USER = getInput('USER')
  const ORIGIN = getInput('ORIGIN')
  const SSHKEY = getInput('SSHKEY')

  const home = homedir()
  const sshFolder = join(home, '.ssh/')
  const sshConfig = join(home, '.ssh', 'config')
  const sshAccess = join(home, '.ssh', 'access')

  const portSSH = (PORT ? `  Port ${PORT}\n` : '')
  const userSSH = (USER ? `  User ${USER}\n` : '')
  const accessText = `Host ${NAME || ORIGIN}\n  HostName ${ORIGIN}\n${userSSH}${portSSH}  IdentityFile ${sshAccess}\n  StrictHostKeyChecking no\n`


  if (process.platform !== 'win32') {
    exec(`ps -p $$ || true`)
    exec(`rm -rf ${sshFolder} || true`)
  } else {
    try {
      exec('(dir 2>&1 *`|echo CMD);&<# rem #>echo PowerShell')
    } catch (error) {
      console.log(`Can't determine if you are using CMD or PowerShell`, { error }, '\n')
    }
    try {
      exec(`rmdir ${sshFolder} /s /q`)
    } catch (error) {
      console.log(`Can't delete ${sshFolder}, don't worry probably doesn't exists yet`, { error }, '\n')
    }
  }

  mkdirSync(sshFolder)

  writeFileSync(sshConfig, accessText)
  exec(`echo "${SSHKEY}" > ${sshAccess}`)

  exec('cat ~/.ssh/config')
  exec('cat ~/.ssh/access')

  if (process.platform !== 'win32') exec(`chmod 755 ${sshFolder}`)
  if (process.platform !== 'win32') exec(`chmod 600 ${sshAccess}`)

  const payload = context ? context.payload || {} : {}
  let userName = 'WayneChu', userEmail = 'paosong91@gmail.com'
  userName = payload.pusher ? (payload.pusher.name || userName) : userName
  userEmail = payload.pusher ? (payload.pusher.email || userEmail) : userEmail
  if (userName !== '') exec(`git config --global user.name "${userName}"`)
  if (userEmail !== '') exec(`git config --global user.email "${userEmail}"`)

} catch (error: any) {
  setFailed(error.message)
}
