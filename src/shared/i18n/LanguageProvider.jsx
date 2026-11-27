import { useEffect, useState } from 'react'
import { LanguageContext } from '@/shared/i18n/LanguageContext.js'
import {
	isSupportedLanguage,
	readLanguage,
	saveLanguage,
} from '@/shared/i18n/language.js'

const browserStorage = () => window.localStorage

export default function LanguageProvider({ children }) {
	const [language, setLanguage] = useState(() => readLanguage(browserStorage))

	useEffect(() => {
		document.documentElement.lang = language
	}, [language])

	function selectLanguage(nextLanguage) {
		if (!isSupportedLanguage(nextLanguage)) return
		saveLanguage(browserStorage, nextLanguage)
		setLanguage(nextLanguage)
	}

	return (
		<LanguageContext.Provider value={{ language, selectLanguage }}>
			{children}
		</LanguageContext.Provider>
	)
}
