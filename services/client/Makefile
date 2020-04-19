all: container
	make start

clientbundle:
	npm run build

start:
	-docker kill progenclient
	docker run -t -p 80:80 --name progenclient --rm progen:0.0.1

container:
	docker build --no-cache -t progen:0.0.1 .
