package routes

import (
	"simplereposerver/api/service"

	"github.com/gofiber/fiber/v2"
)

func PublicGithubAccountRouter(app fiber.Router) {
	app.Get("/profile", service.PublicGitHubProfile())
	app.Get("/repositories", service.PublicGitHubRepository())
}
