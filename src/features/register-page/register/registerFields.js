// Pathing
// _______
// src/features/register-page/register/registerFields.js

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
						label: 'Fornavn',
						autoComplete: 'given-name',
						required: true,
					},
					{
						name: 'lastName',
						label: 'Efternavn',
						autoComplete: 'family-name',
						required: true,
					},
				],
			},
			{
				name: 'email',
				label: 'Email',
				type: 'email',
				autoComplete: 'email',
				required: true,
			},
			{
				name: 'password',
				label: 'Password',
				type: 'password',
				autoComplete: 'new-password',
				required: true,
			},
			{
				name: 'confirmPassword',
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
								label: 'Postnummer',
								autoComplete: 'postal-code',
							},
							{
								name: 'city',
								label: 'By',
								autoComplete: 'address-level2',
							},
						],
					},
					{
						name: 'country',
						label: 'Land',
						autoComplete: 'country-name',
					},
				],
			},
		],
	},
]
