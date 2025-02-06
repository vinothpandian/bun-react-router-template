FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS dev
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS production-dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production --ignore-scripts

FROM base AS build
COPY --from=dev /temp/dev/node_modules node_modules
COPY . .

# Run migrations
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN bun run db:migrate || true

# Run tests and build the app
ENV NODE_ENV=production
RUN bun test
RUN bun run build


FROM base AS prod
COPY --from=production-dependencies /temp/prod/node_modules node_modules
COPY --from=build /usr/src/app/build build
COPY --from=build /usr/src/app/server.ts .
COPY --from=build /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "server.ts" ]