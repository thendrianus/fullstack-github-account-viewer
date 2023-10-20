package main

import (
	"fmt"
	"log"
	"os"
	"simplereposerver/api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	jwtware "github.com/gofiber/contrib/jwt"
)

func main() {

	if os.Getenv("APP_ENV") != "PRODUCTION" {
		err := godotenv.Load()
		fmt.Println(err)
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	fmt.Println(os.Getenv("JWT_SECRET"))

	app := fiber.New()

	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World 👋!")
	})

	authRouterGroup := app.Group("/auth")
	routes.AuthRouter(authRouterGroup)

	publicGithubRouterGroup := app.Group("/public/github")
	routes.PublicGithubAccountRouter(publicGithubRouterGroup)

	secret := os.Getenv("JWT_SECRET")
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(secret)},
	}))

	githubRouterGroup := app.Group("/github")
	routes.GithubAccountRouter(githubRouterGroup)

	app.Listen(":8080")
}
