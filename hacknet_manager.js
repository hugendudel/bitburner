/** @param {NS} ns **/
import { settings, getItem, setItem, localeHHMMSS, createUUID } from './src/common.js'

function getAllStocks(ns) {
  // make a lookup table of all stocks and all their properties
  const stockSymbols = ns.stock.getSymbols();
  const stocks = {};
  for (const symbol of stockSymbols) {

    const pos = ns.stock.getPosition(symbol);
    const stock = {
      symbol: symbol,
      forecast: ns.stock.getForecast(symbol),
      volatility: ns.stock.getVolatility(symbol),
      askPrice: ns.stock.getAskPrice(symbol),
      bidPrice: ns.stock.getBidPrice(symbol),
      maxShares: ns.stock.getMaxShares(symbol),
      shares: pos[0],
      sharesAvgPrice: pos[1],
      sharesShort: pos[2],
      sharesAvgPriceShort: pos[3]
    };
    stock.summary = `${stock.symbol}: ${stock.forecast.toFixed(3)} ± ${stock.volatility.toFixed(3)}`;
    stocks[symbol] = stock;
  }
  return stocks;
}

function getPortfolioValue(stocks) {
  let value = 0;
  for (const stock of Object.values(stocks)) {
    value += stock.bidPrice * stock.shares - stock.askPrice * stock.sharesShort;
  }
  return value;
}

function upgrade_lowest_core(ns) {
  let lowest_node_index = 0
  for (let node = 0; node < ns.hacknet.numNodes(); node++) {
    let lowest_node = ns.hacknet.getNodeStats(lowest_node_index)
    let node_stats = ns.hacknet.getNodeStats(node)
    if (node_stats.cores < lowest_node.cores) {
      lowest_node_index = node
    }
  }

  let upgrade_cost = ns.hacknet.getCoreUpgradeCost(lowest_node_index, 1)
  let player_money = ns.getPlayer().money
  //let total_cash_savings = (getPortfolioValue(getAllStocks(ns)) + player_money) * 0.2
  //if (upgrade_cost < player_money && (player_money - upgrade_cost) > total_cash_savings) {
  if (upgrade_cost < player_money) {
    ns.hacknet.upgradeCore(lowest_node_index, 1)
    ns.tprint(`[${localeHHMMSS()}] Upgraded ${lowest_node_index} core`)
    return true
  }
  return false
}

function upgrade_lowest_ram(ns) {
  let lowest_node_index = 0
  for (let node = 0; node < ns.hacknet.numNodes(); node++) {
    let lowest_node = ns.hacknet.getNodeStats(lowest_node_index)
    let node_stats = ns.hacknet.getNodeStats(node)
    if (node_stats.ram < lowest_node.ram) {
      lowest_node_index = node
    }
  }

  let upgrade_cost = ns.hacknet.getRamUpgradeCost(lowest_node_index, 1)
  let player_money = ns.getPlayer().money
  //let total_cash_savings = (getPortfolioValue(getAllStocks(ns)) + player_money) * 0.2
  //if (upgrade_cost < player_money && (player_money - upgrade_cost) > total_cash_savings) {
  if (upgrade_cost < player_money) {
    ns.hacknet.upgradeRam(lowest_node_index, 1)
    ns.tprint(`[${localeHHMMSS()}] Upgraded ${lowest_node_index} ram`)
    return true
  }
  return false
}

function upgrade_lowest_level(ns) {
  let lowest_node_index = 0
  for (let node = 0; node < ns.hacknet.numNodes(); node++) {
    let lowest_node = ns.hacknet.getNodeStats(lowest_node_index)
    let node_stats = ns.hacknet.getNodeStats(node)
    if (node_stats.level < lowest_node.level) {
      lowest_node_index = node
    }
  }

  let upgrade_cost = ns.hacknet.getLevelUpgradeCost(lowest_node_index, 1)
  let player_money = ns.getPlayer().money
  //let total_cash_savings = (getPortfolioValue(getAllStocks(ns)) + player_money) * 0.2
  //if (upgrade_cost < player_money && (player_money - upgrade_cost) > total_cash_savings) {
  if (upgrade_cost < player_money) {
    ns.hacknet.upgradeLevel(lowest_node_index, 1)
    ns.tprint(`[${localeHHMMSS()}] Upgraded ${lowest_node_index} level`)
    return true
  }
  return false
}

function purchase_node(ns) {
  if (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
    let purchase_cost = ns.hacknet.getPurchaseNodeCost()
    let player_money = ns.getPlayer().money
    //let total_cash_savings = (getPortfolioValue(getAllStocks(ns)) + player_money) * 0.2
    //if (purchase_cost < player_money && (player_money - purchase_cost) > total_cash_savings) {
    if (purchase_cost < player_money) {
      ns.hacknet.purchaseNode()
      ns.tprint(`[${localeHHMMSS()}] Bought node`)
      return true
    }
  }
  return false
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting hacknet_manager.js`)

  let hostname = ns.getHostname()
  if (hostname !== 'home') {
    throw new Error('Run the script from home')
  }

  let keep_percent = 0.5

  while (true) {
    let capacity = ns.hacknet.hashCapacity()
    while (ns.hacknet.numHashes() / capacity > keep_percent) {
      ns.hacknet.spendHashes('Sell for Money')
      await ns.asleep(5)
    }
    while (purchase_node(ns)) {
      await ns.asleep(5)
    }
    while (upgrade_lowest_ram(ns)) {
      await ns.asleep(5)
    }
    while (upgrade_lowest_core(ns)) {
      await ns.asleep(5)
    }
    while (upgrade_lowest_level(ns)) {
      await ns.asleep(5)
    }
    await ns.asleep(5000)
  }
}

// vim: set ft=javascript :
