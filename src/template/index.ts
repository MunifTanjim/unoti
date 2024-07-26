import path from 'path'
import { NotiTemplateError } from '../error'
import type {
  NotiTemplateData,
  NotiTemplateRenderer,
  NotiTemplateRendererOptions,
} from './renderer'
import { renderRaw } from './renderer'
import type { NotiTemplateIdentifier, NotiTemplateMap } from './template-map'
import { getTemplateMap, getTemplateMapKey } from './template-map'
import { defaults } from './util'

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

const defaultConfig = {
  path: path.resolve('templates'),
  data: {},
  options: {},
  renderer: {
    '': renderRaw,
  },
} satisfies NotiTemplateConfig

export function NotiTemplate(config: NotiTemplateConfig): NotiTemplate {
  const templateConfig = defaults(config, defaultConfig)

  const templateMap = getTemplateMap(templateConfig.path)

  const render: NotiTemplate['render'] = async (
    identifier,
    data = {},
    options = {},
  ) => {
    const templateKey = getTemplateMapKey(identifier)

    try {
      const templatePath = templateMap.get(templateKey)

      if (typeof templatePath === 'undefined') {
        throw new NotiTemplateError(
          'template_not_found',
          `Template not found '${templateKey}'`,
          { metadata: { templateId: templateKey } },
        )
      }

      const templateFilename = path.basename(templatePath)

      const templateType = templateFilename.split('.').slice(1).join('.')

      const templateRenderer = templateConfig.renderer[templateType]

      if (typeof templateRenderer !== 'function') {
        throw new NotiTemplateError(
          'template_renderer_not_found',
          `Renderer not found '${templateType}' for template '${templateKey}'`,
          { metadata: { templateId: templateKey, rendererId: templateType } },
        )
      }

      const templateData = defaults(data, templateConfig.data)
      const templateRendererOptions = defaults(options, templateConfig.options)

      return await templateRenderer(
        templatePath,
        templateData,
        templateRendererOptions,
      )
    } catch (err) {
      throw NotiTemplateError.create(err, 'template_render_failure', {
        metadata: { templateId: templateKey },
      })
    }
  }

  return {
    templateMap,
    render,
  }
}
