FROM node:22-bookworm

ARG HTTP_PROXY
ARG HTTPS_PROXY

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get -o Acquire::http::Proxy="${HTTP_PROXY}" -o Acquire::https::Proxy="${HTTPS_PROXY}" update \
  && apt-get -o Acquire::http::Proxy="${HTTP_PROXY}" -o Acquire::https::Proxy="${HTTPS_PROXY}" install -y --no-install-recommends \
    fonts-liberation \
    libreoffice-impress \
    poppler-utils \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
