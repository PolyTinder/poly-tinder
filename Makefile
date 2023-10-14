dev:
	docker-compose -f docker-compose.dev.yml up

dev-minimal:
	docker-compose -f docker-compose.dev.yml up api client db

dev-minimal-storybook:
	docker-compose -f docker-compose.dev.yml up api client db storybook