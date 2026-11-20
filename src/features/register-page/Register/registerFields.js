export const REGISTER_STEPS = [
	{
		name: 'account',
		label: 'Konto',
		fields: [
			{
				name: 'fullName',
				fields: [
					{
						name: 'firstName',
						maxLength: 100,
						label: 'Fornavn',
						autoComplete: 'given-name',
						required: true,
					},
					{
						name: 'lastName',
						maxLength: 100,
						label: 'Efternavn',
						autoComplete: 'family-name',
						required: true,
					},
				],
			},
			{
				name: 'email',
				maxLength: 254,
				label: 'Email',
				type: 'email',
				autoComplete: 'email',
				required: true,
			},
			{
				name: 'password',
				minLength: 8,
				maxLength: 72,
				label: 'Password',
				type: 'password',
				autoComplete: 'new-password',
				required: true,
			},
			{
				name: 'confirmPassword',
				minLength: 8,
				maxLength: 72,
				label: 'Gentag password',
				type: 'password',
				autoComplete: 'new-password',
				required: true,
			},
		],
	},
	{
		name: 'profile',
		label: 'Profil og adresse',
		fields: [
			{
				name: 'contact',
				fields: [
					{
						name: 'phoneNumber',
						maxLength: 30,
						label: 'Telefonnummer',
						type: 'tel',
						autoComplete: 'tel',
					},
					{
						name: 'preferredLanguage',
						label: 'Foretrukket sprog',
						defaultValue: 'da',
						options: [
							{ value: 'da', label: 'Dansk' },
							{ value: 'en', label: 'English' },
						],
					},
				],
			},
			{
				name: 'address',
				legend: 'Adresse',
				fields: [
					{
						name: 'postalArea',
						fields: [
							{
								name: 'postalCode',
								maxLength: 20,
								label: 'Postnummer',
								autoComplete: 'postal-code',
							},
							{
								name: 'city',
								maxLength: 100,
								label: 'By',
								autoComplete: 'address-level2',
							},
						],
					},
					{
						name: 'country',
						maxLength: 100,
						label: 'Land',
						autoComplete: 'country-name',
					},
				],
			},
		],
	},
]
