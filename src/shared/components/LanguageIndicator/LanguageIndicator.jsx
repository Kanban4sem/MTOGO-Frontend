import Dropdown from '@/shared/components/Dropdown/Dropdown.jsx'
import { LANGUAGES } from '@/shared/i18n/language.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import messages from '@/shared/components/LanguageIndicator/messages.json'

function LanguageIndicator() {
	const { language, selectLanguage } = useLanguage()
	const t = useTranslations(messages)
	const { badge } = LANGUAGES.find(({ code }) => code === language)

	return (
		<Dropdown
			variant="white"
			label={badge}
			ariaLabel={`${t('language')}: ${badge}`}
			openOnHover={false}
			actions={LANGUAGES.map(({ code, label }) => ({
				id: code,
				label,
				lang: code,
				selected: code === language,
				onSelect: () => selectLanguage(code),
			}))}
		/>
	)
}

export default LanguageIndicator
