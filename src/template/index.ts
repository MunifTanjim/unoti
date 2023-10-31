import defaultsDeep from 'lodash.defaultsdeep'
import path from 'path'
import { renderRaw } from './renderer'
import { getTemplateMap, getTemplateMapKey } from './template-map'

type NotiTemplateRenderer = import('./renderer').NotiTemplateRenderer
type NotiTemplateData = import('./renderer').NotiTemplateData
type NotiTemplateRendererOptions =
  import('./renderer').NotiTemplateRendererOptions

type NotiTemplateIdentifier = import('./template-map').NotiTemplateIdentifier
type NotiTemplateMap = import('./template-map').NotiTemplateMap

export type NotiTemplate = {
  templateMap: NotiTemplateMap
  render: (
    indentifier: NotiTemplateIdentifier,
    data?: NotiTemplateData,
    options?: NotiTemplateRendererOptions,
  ) => ReturnType<NotiTemplateRenderer>
}

export type NotiTemplateConfig = {
  path: string
  renderer: {
    [templateType: string]: NotiTemplateRenderer
  }
  data?: Record<string, any>
  options?: Record<string, any>
}

export * from './renderer'
export * from './template-map'

const defaultConfig: NotiTemplateConfig = {
  path: path.resolve('templates'),
  data: {},
  options: {},
  renderer: {
    '': renderRaw,
  },
}

export function NotiTemplate(config?: NotiTemplateConfig): NotiTemplate {
  const templateConfig: NotiTemplateConfig = defaultsDeep(config, defaultConfig)

  const templateMap = getTemplateMap(templateConfig.path)

  const render: NotiTemplate['render'] = async (
    identifier,
    data = {},
    options = {},
  ) => {
    const templatePath = templateMap.get(getTemplateMapKey(identifier))

    if (typeof templatePath === 'undefined') {
      throw new Error(`uNoti: TEMPLATE_NOT_FOUND`)
    }

    const templateFilename = path.basename(templatePath)

    const templateType = templateFilename.split('.').slice(1).join('.')

    const templateRenderer = templateConfig.renderer[templateType]

    if (typeof templateRenderer !== 'function') {
      throw new Error(`uNoti: TEMPLATE_RENDERER_NOT_FOUND`)
    }

    const templateData = defaultsDeep(data, templateConfig.data)
    const templateRendererOptions = defaultsDeep(
      options,
      templateConfig.options,
    )

    return await templateRenderer(
      templatePath,
      templateData,
      templateRendererOptions,
    )
  }

  return {
    templateMap,
    render,
  }
}
