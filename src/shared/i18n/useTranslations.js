import { translate } from '@/shared/i18n/translate.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'

export function useTranslations(messages) {
	const { language } = useLanguage()
	return (key, values) => translate(messages, language, key, values)
}
