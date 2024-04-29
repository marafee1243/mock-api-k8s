# mock-api-k8s

Mock REST APIs for practicing Kubernetes


## Intro

This an express.js application application, for experimenting with Kubernetes K8s.

Convient for testing liveness, readiness


### Pre-requistes

1. Node.js > `18.x` or
2. Docker > `24.x.x`


### Container Usage with App

use below environment variables on container

1. `APP_STARTUP_DELAY_IN_SECONDS` : to delay in app start, default is 0


### API Usage

Use any api endpoint with below headers for desired behaviours

http://localhost:3000/ or http://localhost:3000/xxx both the endpoints to same controllers.

Functionalities are handled by custom headers sent in request

| Header name | Usage | Sample value |
| --- | --- | --- |
| X-Crash | terminates/crashes the app | 1 |
| X-Response-Data | response with custom json data, must be JSON format, if invalid, shows default success message | {"status": "custom-message"} |
| X-Status-Code | response with status code | 404 |
| X-Wait | wait for desired 10 seconds | 10 |


### API Usage Examples

#### Crash the app

```
curl --request GET \
  --url http://localhost:3000/ \
  --header 'X-Crash: 1'
```

#### Custom response

```
curl --request GET \
  --url http://localhost:3000/ \
  --header 'X-Response-Data: {"status": "custom-message"}'
```

#### Desired http response code status

```
curl --request GET \
  --url http://localhost:3000/ \
  --header 'X-Status-Code: 500'
```

#### Wait for 10 seconds to response

```
curl --request GET \
  --url http://localhost:3000/ \
  --header 'X-Wait: 10'
```

