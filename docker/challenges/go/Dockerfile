FROM golang:latest AS builder
WORKDIR /usr/src/app
COPY hello.go .
RUN go build hello.go

FROM scratch
COPY --from=builder /usr/src/app/hello .
CMD ["./hello"]
