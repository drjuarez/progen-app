all:
	make build_container
	make run_app

build_container:
	docker build -t progen:latest .

run_app:
	docker run -i -p 5000:5000 progen

init:
	pip install -r requirements.txt
	python db/manage.py db init
	make migration

migration:
	python db/manage.py db migrate

updatedb:
	python db/manage.py db upgrade

seed:
	python db/seed_db.py

clear_dbcache:
	python db/manage.py db.metadata.clear
