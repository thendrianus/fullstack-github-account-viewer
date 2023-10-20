package config

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func ConnectDB() (context.Context, *firestore.Client) {
	// Use a service account
	ctx := context.Background()

	credPath := "./serviceAccount.dev.json"
	if os.Getenv("APP_ENV") == "PRODUCTION" {
		credPath = "./serviceAccount.json"
	}
	sa := option.WithCredentialsFile(credPath)
	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		log.Fatalln(err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
	}

	return ctx, client
}
