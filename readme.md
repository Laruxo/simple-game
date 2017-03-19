# Simple game with NodeJS

Docker required.

### Starting app

```
$ docker-compose up -d
```

In your browser go to [http://localhost:8080/](http://localhost:8080/)

### Test and Lint

```
$ docker-compose run --rm nodejs npm -s test
$ docker-compose run --rm nodejs npm -s run lint
```
