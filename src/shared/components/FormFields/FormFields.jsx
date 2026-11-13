// Pathing
// _______
// src/shared/components/FormFields/FormFields.jsx

import Input from '@/shared/components/Input/Input.jsx'
import Select from '@/shared/components/Select/Select.jsx'
import styles from './FormFields.module.css'

function FormFields({ fields, size = 'm' }) {
	return fields.map(({ name, fields: children, legend, ...options }) => {
		if (children) {
			const content = <FormFields fields={children} size={size} />

			return legend ? (
				<fieldset key={name} className={styles.group}>
					<legend>{legend}</legend>
					{content}
				</fieldset>
			) : (
				<div key={name} className={styles.row}>
					{content}
				</div>
			)
		}

		const Field = options.options ? Select : Input
		return <Field key={name} name={name} size={size} {...options} />
	})
}

export default FormFields
