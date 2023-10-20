FROM golang:alpine

RUN apk update && apk add --no-cache git

RUN apk --no-cache add curl

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o binary ./api

EXPOSE 8080

ENTRYPOINT ["/app/binary"]
