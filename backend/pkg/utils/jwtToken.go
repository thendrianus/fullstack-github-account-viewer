package utils

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type JwtTokenPayloadStruct struct {
	Name              string  `json:"name"`
	Email             string  `json:"email"`
	GithubAccessToken string  `json:"githubAccessToken"`
	GithubUsername    string  `json:"githubUsername"`
	Exp               float64 `json:"exp"`
	Picture           string  `json:"picture"`
}

func GetJwtTokenPayload(c *fiber.Ctx) JwtTokenPayloadStruct {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	jwtTokenPayloadStruct := JwtTokenPayloadStruct{
		Name:              claims["name"].(string),
		Email:             claims["email"].(string),
		GithubAccessToken: claims["githubAccessToken"].(string),
		GithubUsername:    claims["githubUsername"].(string),
		Picture:           claims["picture"].(string),
		Exp:               claims["exp"].(float64),
	}
	return jwtTokenPayloadStruct
}
