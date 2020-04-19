#!make
SHELL := /bin/bash
include .env
export

rebuild: down
	docker-compose build
	make start

start:
	docker-compose up

down:
	docker-compose down && docker-compose rm

pdb:
	docker attach "$$(docker ps -f name=progen-service -q)"

server:
	cd services/service && pipenv run python app.py

client:
	cd services/client && npm start

migrate:
	pipenv run python db/manage.py db migrate

syncdb:
	pipenv run python db/manage.py db upgrade

seed:
	pipenv run python db/seed_db.py

deploy:
	scp -i ~/.ssh/aws.pem .env ubuntu@18.136.202.67:~/progen-app/

nginxdirs:
	-mkdir var/www/
	-cp dist var/www
	-mdkir
	-cp client/nginx.conf etc/nginx/progen
