import { settings, getItem, localeHHMMSS } from './common.js'

const scriptsToKill = [
  'start.js',
  'initHacking.js',
  'runHacking.js',
  'mainHack.js',
  'spider.js',
  'grow.js',
  'hack.js',
  'weaken.js',
  'playerServers.js',
  'find.js',
  'grow.js',
  'hack.js',
  'weaken.js',
  'runHacking.js',
  'mainHacking.js',
  'monitor.js',
]

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting killAll.js`)

  const scriptToRunAfter = ns.args[0]

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  for (let i = 0; i < scriptsToKill.length; i++) {
    await ns.scriptKill(scriptsToKill[i], 'home')
  }

  const serverMap = getItem(settings().keys.serverMap)

  if (serverMap) {
    const killAbleServers = Object.keys(serverMap.servers)
      .filter((hostname) => ns.serverExists(hostname))
      .filter((hostname) => hostname !== 'home')

    for (let i = 0; i < killAbleServers.length; i++) {
      await ns.killall(killAbleServers[i])
    }
  }

  ns.tprint(`[${localeHHMMSS()}] All processes killed`)

  if (scriptToRunAfter) {
    ns.tprint(`[${localeHHMMSS()}] Spawning ${scriptToRunAfter}`)
    ns.spawn(scriptToRunAfter, 1)
  }
}

// vim: set ft=javascript :
