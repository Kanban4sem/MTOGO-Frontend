// Pathing
// _______
// src/shared/components/Select/Select.jsx

import { useId } from 'react'
import styles from './Select.module.css'

function Select({ label, size = 'm', options = [], id, className, ...props }) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const sizeClass = styles[size] ?? styles.m

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={selectId}>
        {label}
      </label>
      <select
        {...props}
        id={selectId}
        className={[styles.select, sizeClass, className]
          .filter(Boolean)
          .join(' ')}
      >
        {options.map(({ value, label, ...optionProps }) => (
          <option {...optionProps} key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
