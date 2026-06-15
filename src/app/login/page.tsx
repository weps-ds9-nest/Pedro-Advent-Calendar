// Server Component — reads DEV_MODE env var and passes it to the client form.
import LoginForm from './LoginForm'

export default function LoginPage() {
  const devMode = process.env.DEV_MODE === 'true'
  return <LoginForm devMode={devMode} />
}
