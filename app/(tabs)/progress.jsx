import { ScreenContainer } from '../../src/components/ScreenContainer'
import { OneRepMaxSummary } from '../../src/components/OneRepMaxSummary'
import { ConsistencyChart } from '../../src/components/ConsistencyChart'
import { useEntriesContext } from '../../src/context/EntriesContext'
import { usePersistedState } from '../../src/hooks/usePersistedState'

export default function ProgressScreen() {
  const { entries } = useEntriesContext()
  const [unit, setUnit] = usePersistedState('flexlog:unit', 'lb')

  return (
    <ScreenContainer>
      <OneRepMaxSummary entries={entries} unit={unit} onUnitChange={setUnit} />
      <ConsistencyChart entries={entries} />
    </ScreenContainer>
  )
}
