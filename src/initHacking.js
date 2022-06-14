const baseUrl = 'https://raw.githubusercontent.com/hugendudel/bitburner/master/src/'
const filesToDownload = [
  'common.js',
  'find.js',
  'grow.js',
  'hack.js',
  'killAll.js',
  'mainHack.js',
  'playerServers.js',
  'runHacking.js',
  'sellAllStock.js',
  'spider.js',
  'stockMarketer.js',
  'weaken.js',
  'browserAutoHack.js',
  'commitCrime.js',
  'contracter.js',
  'gangFastAscender.js',
  'gangManager.js',
  'getCrimesData.js',
  'getCrimesData2.js.js',
  'hackingMission.js',
  'karmaReducer.js',
  'repareGang.js',
  'sellAllStock.js',
  'stockMarketer.js',
  'stockMarketer4S.js',
  'hacknet-auto.script',
  'grow.js',
  'hack.js',
  'weaken.js',
  'runHacking.js',
  'monitor.js',
  'sellHashes.js',
]
const valuesToRemove = ['BB_SERVER_MAP']

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }
  return new Date(ms).toLocaleTimeString()
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting initHacking.js`)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i]
    const path = baseUrl + filename
    await ns.scriptKill(filename, 'home')
    await ns.rm(filename)
    await ns.asleep(200)
    ns.tprint(`[${localeHHMMSS()}] Trying to download ${path}`)
    await ns.wget(path + '?ts=' + new Date().getTime(), filename)
  }

  valuesToRemove.map((value) => localStorage.removeItem(value))

  ns.tprint(`[${localeHHMMSS()}] Spawning killAll.js`)
  ns.spawn('killAll.js', 1, 'runHacking.js')
}

// vim: set ft=javascript :
