export const loginWithGithub = () => {
  const NEXT_PUBLIC_BASE_ENDPOINT = process.env.NEXT_PUBLIC_BASE_ENDPOINT
  const NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID
  window.location.assign(`https://github.com/login/oauth/authorize?client_id=${NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_BASE_ENDPOINT}/github-login-oauth-authorize&scope=repo,user`)
}
