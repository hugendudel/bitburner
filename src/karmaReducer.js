import { getItem, setItem, localeHHMMSS } from './common.js'

const settings = {
  keys: {
    crimesStop: 'BB_CRIMES_STOP',
  },
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting karmaReducer.js`)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  let continueCommitingCrime = true
  const crimeToCommit = 'homicide'

  while (continueCommitingCrime) {
    const crimesStop = getItem(settings.keys.crimesStop)

    if (crimesStop) {
      continueCommitingCrime = false
    } else {
      while (ns.isBusy()) {
        await ns.asleep(100)
      }

      ns.tprint(`[${localeHHMMSS()}] Commiting crime: ${crimeToCommit}`)
      ns.commitCrime(crimeToCommit)
      await ns.asleep(1000)
    }
  }

  setItem(settings.keys.crimesStop, false)
}

// vim: set ft=javascript :
