import { JOURNAL_ENTRY_TYPE } from '../constants'
import { CombatNote, JournalEntryData } from '../models'

export function mapNoteToJournalEntryData(note: CombatNote): JournalEntryData {
  return { type: note.type, uuid: note.uuid }
}

export function getNoteFromJournalEntryData(data: JournalEntryData | null): { error?: string; note?: CombatNote } {
  if (data === null || data.uuid === undefined) {
    // This either is not a valid journal entry or it's something else entirely; either way, we ignore it
    return {}
  }

  const { uuid, type } = data

  if (type !== JOURNAL_ENTRY_TYPE) {
    // Not necessarily an error, but also not a note
    return {}
  }

  const [, id] = uuid.split('.')

  const g = game as Game
  const entry = g.journal?.get(id)

  if (!entry) {
    return { error: 'ACN.overview.error.unknownJournalEntry' }
  }

  const name = entry?.name ?? ''

  if (!name) {
    return { error: 'ACN.overview.error.missingJournalEntryName' }
  }

  return { note: { uuid, id, type, name } }
}