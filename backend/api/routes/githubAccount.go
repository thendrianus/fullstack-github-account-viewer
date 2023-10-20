package routes

import (
	"simplereposerver/api/service"

	"github.com/gofiber/fiber/v2"
)

func GithubAccountRouter(app fiber.Router) {
	app.Get("/profile", service.GitHubProfile())
	app.Get("/repositories", service.GitHubRepository())
}
