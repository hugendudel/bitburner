/** @param {NS} ns */

import {
  localeHHMMSS,
} from './common.js'


function action_success(ns, action_type, action) {
  let success_chance = ns.bladeburner.getActionEstimatedSuccessChance(action_type, action)
  if (success_chance[0] == 1) {
    return true
  }
  return false
}

function select_action(ns) {

  // Field analysis if success chance vary
  let success_chance_vary = ns.bladeburner.getActionEstimatedSuccessChance('BlackOps', 'Operation Daedalus')
  if (success_chance_vary[0] != success_chance_vary[1]) {
    return ['General', 'Field Analysis']
  }
  // Stealth Retirement Operation / Hyperbolic Regeneration Chamber analysis if stamina below 60%
  let stamina = ns.bladeburner.getStamina()
  if (stamina[0] < stamina[1] * 0.5) {
    return ['General', 'Hyperbolic Regeneration Chamber']
  }
  // Diplomacy if chaos is above 30
  if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 30) {
    let action = 'Stealth Retirement Operation'
    let action_type = 'Operation'
    if (ns.bladeburner.getActionCountRemaining(action_type, action) > 0) {
      if (action_success(ns, action_type, action)) {
        return [action_type, action]
      }
    }
    return ['General', 'Diplomacy']
  }

  let action_type = 'Contracts'
  for (const contract of ns.bladeburner.getContractNames()) {
    if (ns.bladeburner.getActionCountRemaining(action_type, contract) > 0) {
      if (action_success(ns, action_type, contract)) {
        return [action_type, contract]
      }
    }
  }
  ns.tprint(`[${localeHHMMSS()}] Action: Training`)
  return ['General', 'Training']
}

function set_action(ns, actione_type, action) {
  ns.bladeburner.startAction(actione_type, action)
  ns.tprint(`[${localeHHMMSS()}] New Action: ${action} ${actione_type}`)
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting bladeburner_manager.js`)

  let hostname = ns.getHostname()
  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  let current_action = ""
  let current_action_type = ""

  while (true) {

    if (ns.bladeburner.getSkillPoints() > ns.bladeburner.getSkillUpgradeCost('Hands of Midas')) {
      ns.bladeburner.upgradeSkill('Hands of Midas')
    }
    if (ns.bladeburner.getSkillPoints() > ns.bladeburner.getSkillUpgradeCost('Hands of Midas')) {
      ns.bladeburner.upgradeSkill("Cyber's Edge")
    }

    let new_action = select_action(ns)
    if (current_action != new_action[1]) {
      set_action(ns, new_action[0], new_action[1])
      current_action = new_action[1]
      current_action_type = new_action[0]
    }

    let action_time = ns.bladeburner.getActionTime(current_action_type, current_action)
    if (ns.bladeburner.getBonusTime() >= action_time) {
      action_time = action_time * 0.2
    } else if (ns.bladeburner.getBonusTime() > 0) {
      action_time = action_time - ns.bladeburner.getBonusTime() * 0.8
    }
    if (current_action == 'Hyperbolic Regeneration Chamber') {
      action_time = action_time * 5
    }
    if (current_action == 'Diplomacy') {
      action_time = action_time * 5
    }
    await ns.asleep(action_time)
    await ns.asleep(10)
  }

}
