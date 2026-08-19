import { OneRepMaxSummary } from '../components/OneRepMaxSummary'
import { ConsistencyChart } from '../components/ConsistencyChart'

export function Progress({ entries, unit, onUnitChange, dark }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <OneRepMaxSummary entries={entries} unit={unit} onUnitChange={onUnitChange} />
      <ConsistencyChart entries={entries} dark={dark} />
    </div>
  )
}
