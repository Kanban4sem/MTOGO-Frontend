import { useContext } from 'react'
import { MaintenanceContext } from '@/shared/context/MaintenanceContext.jsx'

export function useMaintenance() {
	return useContext(MaintenanceContext)
}
