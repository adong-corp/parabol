import {RecordProxy, RecordSourceSelectorProxy} from 'relay-runtime'
import addNodeToArray from 'universal/utils/relay/addNodeToArray'

const handleAddReflectTemplatePrompt = (
  newNode: RecordProxy | null,
  store: RecordSourceSelectorProxy
) => {
  if (!newNode) return
  const templateId = newNode.getValue('templateId')
  const template = store.get(templateId)
  addNodeToArray(newNode, template, 'prompts', 'sortOrder')
}

export default handleAddReflectTemplatePrompt
