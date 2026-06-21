export function settings() {
  return {
    homeRamReserved: 100,
    homeRamReservedBase: 20,
    homeRamExtraRamReserved: 20,
    homeRamBigMode: 64,
    minSecurityLevelOffset: 1,  // security level offset above minimum (weaken)
     maxMoneyMultiplier: 0.9, // multiplier of maximum money on server (grow)
    minSecurityWeight: 100,
    mapRefreshInterval: 24 * 60 * 60 * 1000,  // 1 day in ms
    maxWeakenTime: 30 * 60 * 1000,  // 30 min
    keys: {
      serverMap: 'BB_SERVER_MAP',
    },
    changes: {
      hack: 0.002,
      grow: 0.004,
      weaken: 0.05,
    },

    maxPlayerServers: 25,
    gbRamCost: 110000,
    maxGbRam: 1048576,
    minGbRam: 64,
    totalMoneyAllocation: 0.9,
    actions: {
      BUY: 'buy',
      UPGRADE: 'upgrade',
    },
  }
}

export function getItem(key) {
  let item = localStorage.getItem(key)
  return item ? JSON.parse(item) : undefined
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }
  return new Date(ms).toLocaleTimeString()
}

export function getPlayerDetails(ns) {
  let portHacks = 0
  const hackPrograms = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe',
    'HTTPWorm.exe', 'SQLInject.exe']
  hackPrograms.forEach((hackProgram) => {
    if (ns.fileExists(hackProgram, 'home')) {
      portHacks += 1
    }
  })
  return {
    hackingLevel: ns.getHackingLevel(),
    portHacks,
  }
}

export function createUUID() {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

// vim: set ft=javascript :
