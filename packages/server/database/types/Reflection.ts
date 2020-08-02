import extractTextFromDraftString from 'parabol-client/utils/draftjs/extractTextFromDraftString'
import shortid from 'shortid'
import GoogleAnalyzedEntity from './GoogleAnalyzedEntity'
import Reactji from './Reactji'

export interface ReflectionInput {
  id?: string
  commentingIds?: string[]
  createdAt?: Date
  creatorId: string
  content: string
  plaintextContent?: string // the plaintext version of content
  entities: GoogleAnalyzedEntity[]
  meetingId: string
  reactjis?: Reactji[]
  reflectionGroupId?: string
  retroPhaseItemId: string
  sortOrder?: number
  updatedAt?: Date
}

export default class Reflection {
  id: string
  autoReflectionGroupId?: string
  commentingIds?: string[]
  createdAt: Date
  creatorId: string
  content: string
  plaintextContent: string
  entities: GoogleAnalyzedEntity[]
  isActive: boolean
  meetingId: string
  reactjis: Reactji[]
  reflectionGroupId: string
  retroPhaseItemId: string
  sortOrder: number
  updatedAt: Date
  constructor(input: ReflectionInput) {
    const {
      commentingIds,
      content,
      plaintextContent,
      createdAt,
      creatorId,
      entities,
      id,
      meetingId,
      reactjis,
      reflectionGroupId,
      retroPhaseItemId,
      sortOrder,
      updatedAt
    } = input
    const now = new Date()
    this.id = id || shortid.generate()
    this.commentingIds = commentingIds
    this.createdAt = createdAt || now
    this.creatorId = creatorId
    this.content = content
    this.plaintextContent = plaintextContent || extractTextFromDraftString(content)
    this.entities = entities
    this.isActive = true
    this.meetingId = meetingId
    this.reactjis = reactjis || []
    this.reflectionGroupId = reflectionGroupId || shortid.generate()
    this.retroPhaseItemId = retroPhaseItemId
    this.sortOrder = sortOrder || 0
    this.updatedAt = updatedAt || now
  }
}
