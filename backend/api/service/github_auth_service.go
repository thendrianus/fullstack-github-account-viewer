package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"simplereposerver/api/presenter"
	"simplereposerver/pkg/entities"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"

	"github.com/golang-jwt/jwt/v5"
)

var (
	gitHubState = "randomState"
)

type GitHubProfileResponseStruct struct {
	AvatarURL  string      `json:"avatar_url"`
	Name       string      `json:"name"`
	Email      string      `json:"email"`
	Login      string      `json:"login"`
	Followers  int         `json:"followers"`
	Following  int         `json:"following"`
	Bio        string      `json:"bio"`
	TotalVisit int         `json:"totalVisit"`
	Visitors   []UserVisit `json:"visitors"`
}

func oAuthGitHubConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_OAUTH_CLIENT_SECRET"),
		Endpoint:     github.Endpoint,
	}
}

func getGithubLoginOauthToken(c *fiber.Ctx) (string, error) {
	payload := struct {
		Code string `json:"code"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		fmt.Print(err)
		c.Status(http.StatusInternalServerError)
		return "", c.JSON(presenter.Failure(err))
	}

	token, err := oAuthGitHubConfig().Exchange(context.Background(), payload.Code)

	if err != nil {
		fmt.Print(err)
		c.Status(http.StatusInternalServerError)
		return "", c.JSON(presenter.Failure(err))
	}

	return token.AccessToken, nil
}

func getGithubUserData(c *fiber.Ctx, accessToken string) (GitHubProfileResponseStruct, error) {
	client := &http.Client{}

	githubResponse := GitHubProfileResponseStruct{}

	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		fmt.Println("Get github user error", err)
		c.Status(http.StatusInternalServerError)
		return githubResponse, c.JSON(presenter.Failure(err))
	}

	req.Header.Set("Authorization", "token "+accessToken)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Client do Github request", err)
		c.Status(http.StatusInternalServerError)
		return githubResponse, c.JSON(presenter.Failure(err))
	}

	err = json.NewDecoder(resp.Body).Decode(&githubResponse)
	if err != nil {
		fmt.Println("Encode the body", err)
	}
	return githubResponse, nil
}

func generateJWTToken(c *fiber.Ctx, userData entities.User) (string, error) {
	claims := jwt.MapClaims{
		"name":              userData.Name,
		"email":             userData.Email,
		"githubAccessToken": userData.GithubAccessToken,
		"githubUsername":    userData.GithubUsername,
		"picture":           userData.Picture,
		"exp":               time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secret := os.Getenv("JWT_SECRET")

	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", c.SendStatus(fiber.StatusInternalServerError)
	}
	return t, nil
}

func GitHubLogin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		accessToken, err := getGithubLoginOauthToken(c)
		if err != nil {
			return err
		}

		githubResponse, err := getGithubUserData(c, accessToken)
		fmt.Println(githubResponse)
		if err != nil {
			return err
		}

		var userData = entities.User{
			Name:              githubResponse.Name,
			Email:             githubResponse.Email,
			GithubAccessToken: accessToken,
			Picture:           githubResponse.AvatarURL,
			GithubUsername:    githubResponse.Login,
		}

		jwtToken, err := generateJWTToken(c, userData)
		if err != nil {
			return err
		}

		return c.JSON(presenter.TokenResponse(jwtToken, userData))

	}

}
