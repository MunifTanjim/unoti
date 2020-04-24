import fs from 'fs'
import util from 'util'

export type NotiTemplateData = Record<string, any>

export type NotiTemplateRendererOptions = Record<string, any>

export type NotiTemplateRenderer = (
  templatePath: string,
  data?: NotiTemplateData,
  options?: NotiTemplateRendererOptions
) => Promise<string>

const readFile = util.promisify(fs.readFile)

export const renderRaw: NotiTemplateRenderer = async (templatePath) => {
  return await readFile(templatePath, { encoding: 'utf8' })
}
