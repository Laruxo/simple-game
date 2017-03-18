# Simple game with NodeJS

Docker required.

### Starting app

```
$ docker-compose up -d
```

In your browser go to [http://localhost:8080/](http://localhost:8080/)

### Test and Lint

Once app is running you can run tests and linter.
```
$ docker-compose exec nodejs npm -s run lint
$ docker-compose exec nodejs npm -s run test
```
