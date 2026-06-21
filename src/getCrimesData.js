import { getItem, setItem, localeHHMMSS } from './common.js'

const settings = {
  keys: {
    crimes: 'BB_CRIMES',
  },
  crimes: [
    'shoplift',
    'rob store',
    'mug',
    'larceny',
    'deal drugs',
    'bond forgery',
    'traffick arms',
    'homicide',
    'grand theft auto',
    'kidnap',
    'assassinate',
    'heist',
  ],
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting getCrimesData.js`)

  const scriptToRunAfter = ns.args[0] || 'getCrimesData2.js'

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  const crimesCache = getItem(settings.keys.crimes) || {}
  const crimes = {}

  settings.crimes.map((crime) => {
    const chance = ns.getCrimeChance(crime)

    crimes[crime] = { ...crimesCache[crime], chance }
  })

  setItem(settings.keys.crimes, crimes)

  if (scriptToRunAfter) {
    ns.tprint(`[${localeHHMMSS()}] Spawning ${scriptToRunAfter}`)
    ns.spawn(scriptToRunAfter, 1)
  }
}

// vim: set ft=javascript :
