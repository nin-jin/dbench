docker rm -f dbench-mongo
docker run -d --name dbench-mongo mongo

docker rm -f dbench-orient
docker run -d -e ORIENTDB_ROOT_PASSWORD=root --name dbench-orient joaodubas/orientdb

docker rm -f dbench-postgres
docker run -d -e POSTGRES_PASSWORD=postgres --name dbench-postgres postgres

docker build -t dbench ./
docker rm -f dbench
docker run -t -i --link dbench-mongo --link dbench-orient --link dbench-postgres --name dbench dbench