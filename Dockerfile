ARG PYTHON_VER=3.11
ARG PYTHON_IMG_TYPE=alpine

FROM python:${PYTHON_VER}-${PYTHON_IMG_TYPE} AS builder

ARG PYTHON_VER=3.11
ARG PYTHON_IMG_TYPE=alpine
ARG EXT_TYPE=essential
RUN if test "${PYTHON_IMG_TYPE}" = 'alpine' && test "${EXT_TYPE}" != 'essential'; then \
    apk add --update gcc musl-dev make cargo; \
    elif test "${PYTHON_IMG_TYPE}" = 'slim' && test "${EXT_TYPE}" != 'essential'; then \
    apt-get update -qq; apt-get install --no-install-recommends libc6-dev gcc make cargo -y;  \
    fi
COPY requirements.txt /tmp/requirements.txt
RUN pip wheel -r /tmp/requirements.txt --wheel-dir /tmp/wheels

FROM python:${PYTHON_VER}-${PYTHON_IMG_TYPE}
COPY --from=builder /tmp/wheels/* /tmp/wheels/
RUN pip install /tmp/wheels/*.whl && rm -rf /tmp
ARG TARGETARCH
ARG TARGETVARIANT
RUN apk --no-cache add ca-certificates tini
RUN apk add tzdata && \
	cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
	echo "Asia/Shanghai" > /etc/timezone && \
	apk del tzdata

WORKDIR /root/
COPY . .
VOLUME /root
#COPY entrypoint.sh /entrypoint.sh
RUN apk add --no-cache bash && chmod +x /entrypoint.sh
RUN chmod -R 777 /root

CMD [ "/entrypoint.sh" ]
EXPOSE 8000
USER 10001
