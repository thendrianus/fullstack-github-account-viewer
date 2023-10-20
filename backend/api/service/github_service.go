package service

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"simplereposerver/api/presenter"
	"simplereposerver/config"
	"simplereposerver/pkg/utils"
	"time"

	"github.com/gofiber/fiber/v2"
	"google.golang.org/api/iterator"

	"github.com/golang-jwt/jwt/v5"

	"cloud.google.com/go/firestore"
)

func getUserGithubUsername(c *fiber.Ctx) string {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)

	githubUsername := claims["githubUsername"].(string)
	return githubUsername
}

func GitHubProfile() fiber.Handler {
	return func(c *fiber.Ctx) error {

		jwtPayload := utils.GetJwtTokenPayload(c)

		return getGithubUserProfile(c, jwtPayload)

	}
}

func GitHubRepository() fiber.Handler {
	return func(c *fiber.Ctx) error {

		jwtPayload := utils.GetJwtTokenPayload(c)

		return getGithubUserRepository(c, jwtPayload)

	}

}

func PublicGitHubProfile() fiber.Handler {
	return func(c *fiber.Ctx) error {

		return getGithubUserProfile(c, utils.JwtTokenPayloadStruct{})

	}
}

func PublicGitHubRepository() fiber.Handler {
	return func(c *fiber.Ctx) error {

		return getGithubUserRepository(c, utils.JwtTokenPayloadStruct{})

	}

}

type GitHubRepositoryStruct struct {
	Private     bool   `json:"private"`
	Name        string `json:"name"`
	Description string `json:"description"`
	UpdatedAt   string `json:"updated_at"`
	Language    string `json:"language"`
}

type UserVisitCount struct {
	TotalVisit  int    `json:"total_visit,omitempty"`
	UpdatedTime string `json:"updated_time,omitempty"`
	Username    string `json:"username,omitempty"`
}

func updateUserVisitCount(username string) int {
	ctx, client := config.ConnectDB()

	_, err := client.Collection("user_visit_count").Doc(username).Set(ctx, map[string]interface{}{
		"total_visit":  firestore.Increment(1),
		"updated_time": firestore.ServerTimestamp,
		"username":     username,
	}, firestore.MergeAll)

	if err != nil {
		log.Fatalf("Failed adding alovelace: %v", err)
	}

	var userVisitCount UserVisitCount
	state, _ := client.Collection("user_visit_count").Doc(username).Get(ctx)
	bs, err := json.Marshal(state.Data())
	json.Unmarshal(bs, &userVisitCount)

	defer client.Close()
	return userVisitCount.TotalVisit
}

type UserVisit struct {
	Username        string    `firestore:"username,omitempty"`
	LastVisitTime   time.Time `firestore:"last_visit_time,omitempty"`
	VisitorAvatar   string    `firestore:"visitor_avatar_url,omitempty"`
	VisitorUsername string    `firestore:"visitor_username,omitempty"`
}

func updateUserVisit(username string, loginUsername string, loginUserAvatar string) []UserVisit {
	ctx, client := config.ConnectDB()

	if username != loginUsername && loginUsername != "" {
		_, err := client.Collection("user_visitor_list").Doc(username+" "+loginUsername).Set(ctx, map[string]interface{}{
			"username":           username,
			"last_visit_time":    firestore.ServerTimestamp,
			"visitor_avatar_url": loginUserAvatar,
			"visitor_username":   loginUsername,
		}, firestore.MergeAll)

		if err != nil {
			log.Fatalf("Failed adding alovelace: %v", err)
		}
	}

	var userVisits []UserVisit
	docIterator := client.Collection("user_visitor_list").Where("username", "==", username).OrderBy("last_visit_time", firestore.Desc).Limit(5).Documents(ctx)
	defer docIterator.Stop()

	for {
		doc, err := docIterator.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			fmt.Println(err)
		}
		var userVisit UserVisit
		if err := doc.DataTo(&userVisit); err != nil {
			fmt.Println(err)
		}
		fmt.Println(doc.Data())
		userVisits = append(userVisits, userVisit)
	}
	defer client.Close()
	return userVisits
}

func getGithubUserProfile(c *fiber.Ctx, jwtPayload utils.JwtTokenPayloadStruct) error {
	accessToken := jwtPayload.GithubAccessToken
	client := &http.Client{}
	payload := c.Queries()

	req, err := http.NewRequest("GET", "https://api.github.com/users/"+payload["githubUsername"], nil)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return c.JSON(presenter.Failure(err))
	}

	if accessToken != "" {
		req.Header.Set("Authorization", "Bearer "+accessToken)
	}
	fmt.Println("accessToken", accessToken)
	resp, err := client.Do(req)

	if resp.StatusCode == 404 {
		return c.JSON(presenter.Failure("Github Profile is not found"))
	}
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return c.JSON(presenter.Failure(err))
	}

	githubResponse := GitHubProfileResponseStruct{}
	err = json.NewDecoder(resp.Body).Decode(&githubResponse)
	if err != nil {
		fmt.Println("Encode the body", err)
	}

	githubResponse.TotalVisit = updateUserVisitCount(payload["githubUsername"])
	if accessToken != "" {
		githubResponse.Visitors = updateUserVisit(payload["githubUsername"], jwtPayload.GithubUsername, jwtPayload.Picture)
	} else {
		githubResponse.Visitors = updateUserVisit(payload["githubUsername"], "", "")
	}

	return c.JSON(presenter.Success(githubResponse, "Success fetch github user profile"))
}

func getGithubUserRepository(c *fiber.Ctx, jwtPayload utils.JwtTokenPayloadStruct) error {

	accessToken := jwtPayload.GithubAccessToken
	client := &http.Client{}
	payload := c.Queries()

	githubRepoEndpoint := "https://api.github.com/users/" + payload["githubUsername"] + "/repos?per_page=6"

	if accessToken != "" && getUserGithubUsername(c) == payload["githubUsername"] {
		githubRepoEndpoint = "https://api.github.com/user/repos?per_page=6"
	}

	req, err := http.NewRequest("GET", githubRepoEndpoint, nil)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return c.JSON(presenter.Failure(err))
	}

	if accessToken != "" {
		req.Header.Set("Authorization", "Bearer "+accessToken)
	}
	fmt.Println("accessToken", accessToken)

	resp, err := client.Do(req)

	if resp.StatusCode == 404 {
		return c.JSON(presenter.Failure("Github repository is not found"))
	}
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return c.JSON(presenter.Failure(err))
	}

	var githubResponse []GitHubRepositoryStruct
	err = json.NewDecoder(resp.Body).Decode(&githubResponse)
	if err != nil {
		fmt.Println("Encode the body", err)
	}

	return c.JSON(presenter.Success(githubResponse, "Success fetch github user repositories"))
}
