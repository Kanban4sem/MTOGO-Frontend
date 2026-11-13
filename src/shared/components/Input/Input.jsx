// Pathing
// _______
// src/shared/components/Input/Input.jsx

import { useId } from 'react'
import styles from './Input.module.css'

function Input({ label, size = 'm', id, className, ...options }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const sizeClass = styles[size] ?? styles.m

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        {...options}
        id={inputId}
        className={[styles.input, sizeClass, className]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  )
}

export default Input
