package entities

type User struct {
	Name              string `json:"name"`
	Email             string `json:"email"`
	GithubAccessToken string `json:"githubAccessToken"`
	Picture           string `json:"picture"`
	GithubUsername    string `json:"githubUsername"`
}
