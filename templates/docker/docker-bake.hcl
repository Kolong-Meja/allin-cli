group "default" {
  targets = ["your-app"]
}

target "your-app" {
  context    = "."
  dockerfile = "Dockerfile"
  tags       = ["your-app-image:latest"]
  platforms  = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=local,src=.cache"]
  cache-to   = ["type=local,dest=.cache,mode=max"]
}