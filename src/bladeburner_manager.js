/** @param {NS} ns */

import {
  localeHHMMSS,
} from './common.js'

function skill_upgrade(ns, skill) {
  let result = ns.bladeburner.upgradeSkill(skill)
  if (result) {
    ns.tprint(`[${localeHHMMSS()}] Upgraded: ${skill}`)
  } else {
    ns.tprint(`[${localeHHMMSS()}] Failed to upgrade: ${skill}`)
  }
}

function skill_upgradeable(ns, skill) {
  let skill_points = ns.bladeburner.getSkillPoints()
  let skill_upgrade_cost = ns.bladeburner.getSkillUpgradeCost(skill)
  if (skill_points > skill_upgrade_cost) {
    return true
  }
  return false
}

function upgrade_skills(ns) {
  for (const skill of ns.bladeburner.getSkillNames().reverse()) {
    let skill_level = ns.bladeburner.getSkillLevel(skill)
    if (skill_upgradeable(ns, skill)) {
      // upgrade everyting to 10
      if (skill_level < 10) {
        skill_upgrade(ns, skill)
        return true
      } else {
        if (skill == "Digital Observer") {
          skill_upgrade(ns, skill)
          return true
        } else if (skill == "Overclock" && skill_level < 90) {
          skill_upgrade(ns, skill)
          return true
        } else if (skill == "Blade's Intuition") {
          skill_upgrade(ns, skill)
          return true
        }
      }
    }
  }
  return false
}

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
  // Field analysis if stamina below 60%
  let stamina = ns.bladeburner.getStamina()
  if (stamina[0] < stamina[1] * 0.6) {
    return ['General', 'Field Analysis']
  }
  // Diplomacy if chaos is above 30
  if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 30) {
    return ['General', 'Diplomacy']
  }

  let action_type = 'BlackOps'
  for (const blackop of ns.bladeburner.getBlackOpNames()) {
    if (ns.bladeburner.getBlackOpRank(blackop) < ns.bladeburner.getRank()) {
      if (ns.bladeburner.getActionCountRemaining(action_type, blackop) > 0) {
        if (action_success(ns, action_type, blackop)) {
          return [action_type, blackop]
        }
      }
    }
  }

  action_type = 'Operations'
  for (const operation of ns.bladeburner.getOperationNames().reverse()) {
    if (ns.bladeburner.getActionCountRemaining(action_type, operation) > 0) {
      if (action_success(ns, action_type, operation)) {
        // Raid only if available
        if (operation == "Raid") {
          if (ns.bladeburner.getCityCommunities(ns.bladeburner.getCity()) > 0) {
            return [action_type, operation]
          }
        } else {
          return [action_type, operation]
        }
      }
    }
  }
  action_type = 'Contracts'
  let contract = 'Tracking'
  if (ns.bladeburner.getActionCountRemaining(action_type, contract) > 0) {
    if (action_success(ns, action_type, contract)) {
      return [action_type, contract]
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
    while (upgrade_skills(ns)) {
      await ns.asleep(10)
    }

    let new_action = select_action(ns)
    if (current_action != new_action[1]) {
      set_action(ns, new_action[0], new_action[1])
      current_action = new_action[1]
      current_action_type = new_action[0]
    }
    //ns.tprint(`[${localeHHMMSS()}] New Action: ${new_action[1]} Current Action: ${current_action}`)

    let action_time = ns.bladeburner.getActionTime(current_action_type, current_action)
    if (ns.bladeburner.getBonusTime() >= action_time) {
      action_time = action_time * 0.2
    } else if (ns.bladeburner.getBonusTime() > 0) {
      action_time = action_time - ns.bladeburner.getBonusTime() * 0.8
    }
    await ns.asleep(action_time)
    await ns.asleep(10)
  }

}
