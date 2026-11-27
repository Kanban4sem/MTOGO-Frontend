import { useContext } from 'react'
import { LanguageContext } from '@/shared/i18n/LanguageContext.js'

export function useLanguage() {
	return useContext(LanguageContext)
}
