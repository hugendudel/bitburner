/** @param {NS} ns **/
import { settings, getItem, setItem, localeHHMMSS, createUUID } from './common.js'


export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting playerServers.js`)

  let hostname = ns.getHostname()
  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  let keep_percent = 0.5

  while (true) {
    let capacity = ns.hacknet.hashCapacity()
    while (ns.hacknet.numHashes() / capacity > keep_percent) {
      ns.hacknet.spendHashes('Sell for Money')
      await ns.asleep(1)
    }

    await ns.asleep(5000)
  }
}

// vim: set ft=javascript :
