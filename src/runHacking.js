import { localeHHMMSS } from './common.js'

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting runHacking.js`)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  const homeRam = ns.getServerMaxRam('home')

  if (homeRam >= 32) {
    ns.tprint(`[${localeHHMMSS()}] Spawning spider.js`)
    await ns.run('spider.js', 1, 'mainHack.js')
    //await ns.asleep(1000)
    //ns.tprint(`[${localeHHMMSS()}] Spawning hacknet-auto.script`)
    //ns.spawn('hacknet-auto.script', 1)
    //await ns.asleep(120 * 1000)
    //ns.tprint(`[${localeHHMMSS()}] Spawning playerServer.js`)
    //ns.spawn('playerServer.js', 1)
    //await ns.asleep(300 * 1000)
    //ns.tprint(`[${localeHHMMSS()}] Spawning stockMarketer.js`)
    //ns.spawn('stockMarketer.js', 1)
  } else {
    ns.tprint(`[${localeHHMMSS()}] Spawning spider.js`)
    ns.spawn('spider.js', 1, 'mainHack.js')
  }
}

// vim: set ft=javascript :
