// Pathing
// _______
// src/features/login-page/login/Login.jsx

import { Link } from 'react-router-dom'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { LOGIN_FIELDS } from './loginFields.js'
import { handleLoginSubmit } from './Login.hooks.js'
import styles from './Login.module.css'

function Login() {
  return (
    <section className={styles.login} aria-labelledby="login-title">
      <h1 id="login-title">Log ind</h1>
      <form className={styles.form} onSubmit={handleLoginSubmit}>
        <FormFields fields={LOGIN_FIELDS} />
        <Button label="Log ind" type="submit" />
      </form>
      <p>
        Har du ikke en konto? <Link to="/register">Opret en konto</Link>
      </p>
    </section>
  )
}

export default Login
