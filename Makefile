dev:
	docker compose -f docker-compose.dev.yml up api client admin api-admin db

dev-minimal:
	docker compose -f docker-compose.dev.yml up api client db

dev-minimal-storybook:
	docker compose -f docker-compose.dev.yml up api client db storybook

test-api:
	docker compose -p poly-tinder-test-api -f docker-compose.test.yml up \
		--exit-code-from api-test \
		--abort-on-container-exit \
		--quiet-pull \
		--no-log-prefix \
		--build \
		api-test