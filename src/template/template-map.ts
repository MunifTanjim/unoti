import fs from 'fs'
import path from 'path'

export type NotiTemplateIdentifier = {
  channel: string
  topic: string
  param: string
}

export type NotiTemplateMap = Map<string, string>

const dirLevels = { CHANNEL: 0, TOPIC: 1, PARAM: 2 }

export function getTemplateMapKey({
  channel,
  topic,
  param,
}: NotiTemplateIdentifier): string {
  return `${channel}--${topic}--${param}`
}

export function getTemplateMap(
  dirPath: string,
  dirLevel: number = 0,
  channel?: string,
  topic?: string,
): NotiTemplateMap {
  const templateMap = new Map<string, string>()

  if (dirLevel > dirLevels.PARAM) {
    return templateMap
  }

  const dirents = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const dirent of dirents) {
    const currentName = dirent.name
    const currentPath = path.join(dirPath, currentName)

    if (dirLevel === dirLevels.PARAM) {
      const param = currentName.split('.')[0]

      const templateIdentifier = { channel, topic, param }

      templateMap.set(
        getTemplateMapKey(templateIdentifier as NotiTemplateIdentifier),
        currentPath,
      )

      continue
    }

    if (dirent.isDirectory()) {
      const map = getTemplateMap(
        currentPath,
        dirLevel + 1,
        dirLevel === dirLevels.CHANNEL ? currentName : channel,
        dirLevel === dirLevels.TOPIC ? currentName : topic,
      )

      for (const [key, value] of map.entries()) {
        templateMap.set(key, value)
      }
    }
  }

  return templateMap
}
