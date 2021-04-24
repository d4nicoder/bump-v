#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const baseDir = ''
const jsonFile = path.resolve(path.join(baseDir, 'package.json'))

// getting arg
const type = process.argv[2]

if (!['patch', 'minor', 'major'].includes(type)) {
  console.error(`Bad argument "${type}". Only allowed "patch", "minor", "major"`)
  process.exit(1)
}

// Parsing package.json
const json = JSON.parse(fs.readFileSync(jsonFile).toString())

let ver = json.version.split('.')

let [major, minor, patch ] = ver

if (type === 'patch') {
  if (/^\d+$/.test(patch)) {
    ver[2]++
  } else {
    if (ver.length < 4) {
      console.error('Bad format on path version')
      process.exit(2)
    }
    ver[ver.length - 1]++
  }
} else if (type === 'minor') {
  ver[2] = 0
  ver[1]++

  ver = ver.splice(0, 3)
} else if (type === 'major') {
  ver[0]++
  ver[1] = 0
  ver[2] = 0

  ver = ver.splice(0, 3)
}

json.version = ver.join('.')

console.log(json.version)

fs.writeFileSync(jsonFile, JSON.stringify(json, null, '  '))
process.exit(0)