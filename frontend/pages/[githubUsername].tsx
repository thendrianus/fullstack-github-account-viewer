import { useRouter } from 'next/router'
import Home from '.'

const GithubId = () => {
  const router = useRouter()
  const { githubUsername } = router.query

  return githubUsername ? <Home githubUsername={githubUsername as string}/> : ''
}

export default GithubId
