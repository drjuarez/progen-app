FROM postgres:11
RUN apt-get update -y && apt-get install -y python3-pip python3-dev \
    libcurl4-openssl-dev libssl-dev build-essential libffi-dev \
    libxml2-dev libxslt1-dev zlib1g-dev libpq-dev \
    lsof curl vim tcpdump dnsutils

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY db/init-db.sh /docker-entrypoint-initdb.d/init-db.sh

WORKDIR /service-container
COPY ./ ./
ENTRYPOINT ["bash", "./entry.sh"]