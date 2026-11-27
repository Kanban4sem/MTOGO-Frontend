export function getRegisterSteps(t, language) {
	return [
		{
			name: 'account',
			label: t('account'),
			fields: [
				{
					name: 'fullName',
					fields: [
						{
							name: 'firstName',
							maxLength: 100,
							label: t('firstName'),
							autoComplete: 'given-name',
							required: true,
						},
						{
							name: 'lastName',
							maxLength: 100,
							label: t('lastName'),
							autoComplete: 'family-name',
							required: true,
						},
					],
				},
				{
					name: 'email',
					maxLength: 254,
					label: t('email'),
					type: 'email',
					autoComplete: 'email',
					required: true,
				},
				{
					name: 'password',
					minLength: 8,
					maxLength: 72,
					label: t('password'),
					type: 'password',
					autoComplete: 'new-password',
					required: true,
				},
				{
					name: 'confirmPassword',
					minLength: 8,
					maxLength: 72,
					label: t('repeatPassword'),
					type: 'password',
					autoComplete: 'new-password',
					required: true,
				},
			],
		},
		{
			name: 'profile',
			label: t('profileAndAddress'),
			fields: [
				{
					name: 'contact',
					fields: [
						{
							name: 'phoneNumber',
							maxLength: 30,
							label: t('phoneNumber'),
							type: 'tel',
							autoComplete: 'tel',
						},
						{
							name: 'preferredLanguage',
							label: t('preferredLanguage'),
							defaultValue: language,
							options: [
								{ value: 'da', label: 'Dansk' },
								{ value: 'en', label: 'English' },
							],
						},
					],
				},
				{
					name: 'address',
					legend: t('address'),
					fields: [
						{
							name: 'postalArea',
							fields: [
								{
									name: 'postalCode',
									maxLength: 20,
									label: t('postalCode'),
									autoComplete: 'postal-code',
								},
								{
									name: 'city',
									maxLength: 100,
									label: t('city'),
									autoComplete: 'address-level2',
								},
							],
						},
						{
							name: 'country',
							maxLength: 100,
							label: t('country'),
							autoComplete: 'country-name',
						},
					],
				},
			],
		},
	]
}
