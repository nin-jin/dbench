docker rm -f dbench-mongo
docker run -d -p 27020:27017 --name dbench-mongo mongo

docker rm -f dbench-orient
docker run -d -p 2424:2424 -p 2480:2480 -e ORIENTDB_ROOT_PASSWORD root --name dbench-orient joaodubas/orientdb

docker rm -f dbench-postgres
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name dbench-postgres postgres

docker build -t dbench:dbench ./
docker run -t -d -i -p 27020:27017 -p 2424:2424 -p 5432:5432 dbench:dbench