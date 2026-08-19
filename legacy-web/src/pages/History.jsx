import { WorkoutHistory } from '../components/WorkoutHistory'

export function History({ entries, onDelete, onEdit }) {
  return <WorkoutHistory entries={entries} onDelete={onDelete} onEdit={onEdit} />
}
