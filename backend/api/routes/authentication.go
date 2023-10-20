package routes

import (
	"simplereposerver/api/service"

	"github.com/gofiber/fiber/v2"
)

func AuthRouter(app fiber.Router) {
	// In the future can use another type of login
	app.Post("/github/login", service.GitHubLogin())
}
