# Load environment variables from .env file
include .env
export $(shell sed 's/=.*//' .env)

IMAGE_NAME := pilakon-svelte

docker-build:
	echo "Building docker image with PUBLIC_SUPABASE_URL=$(PUBLIC_SUPABASE_URL) and PUBLIC_SUPABASE_ANON_KEY=$(PUBLIC_SUPABASE_ANON_KEY)"
	docker build --build-arg PUBLIC_SUPABASE_URL=$(PUBLIC_SUPABASE_URL) --build-arg PUBLIC_SUPABASE_ANON_KEY=$(PUBLIC_SUPABASE_ANON_KEY) -t ${IMAGE_NAME} .

docker-nginx:
	echo "Starting SvelteKit with Nginx..."
	docker compose up nginx app

docker-nginx-build:
	echo "Building SvelteKit with Nginx..."
	docker compose build nginx app

docker-nginx-up:
	echo "Starting SvelteKit with Nginx..."
	docker compose up nginx app

docker-nginx-down:
	echo "Stopping SvelteKit with Nginx..."
	docker compose down