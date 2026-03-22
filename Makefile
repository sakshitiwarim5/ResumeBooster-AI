.PHONY: help dev-backend dev-frontend dev install-backend install-frontend \
        migrate migrate-new test test-backend lint docker-up docker-down docker-build clean

# ── Colors ────────────────────────────────────────────────────
CYAN  := \033[0;36m
GREEN := \033[0;32m
RESET := \033[0m

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-22s$(RESET) %s\n", $$1, $$2}'

# ── Install ───────────────────────────────────────────────────
install-backend: ## Install Python dependencies
	cd backend && pip install -r requirements.txt

install-frontend: ## Install Node dependencies
	cd frontend && npm install

install: install-backend install-frontend ## Install all dependencies

# ── Dev servers ───────────────────────────────────────────────
dev-backend: ## Run FastAPI with auto-reload
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run Vite dev server
	cd frontend && npm run dev

dev: ## Run both servers in parallel (requires tmux or GNU parallel)
	@echo "$(GREEN)Starting backend on :8000 and frontend on :5173$(RESET)"
	@(cd backend && uvicorn main:app --reload --port 8000) & \
	 (cd frontend && npm run dev) & \
	wait

# ── Database ──────────────────────────────────────────────────
db-create: ## Create the hireboost database
	psql -U postgres -c "CREATE DATABASE hireboost;" || true

migrate: ## Run Alembic migrations
	cd backend && alembic upgrade head

migrate-new: ## Generate a new migration (usage: make migrate-new MSG="add column")
	cd backend && alembic revision --autogenerate -m "$(MSG)"

migrate-down: ## Rollback one migration
	cd backend && alembic downgrade -1

# ── Tests ─────────────────────────────────────────────────────
test-backend: ## Run backend tests
	cd backend && pytest tests/ -v --tb=short

test: test-backend ## Run all tests

# ── Lint / Format ─────────────────────────────────────────────
lint-backend: ## Lint backend with ruff
	cd backend && ruff check . --fix

format-backend: ## Format backend with black
	cd backend && black .

lint-frontend: ## Lint frontend with eslint
	cd frontend && npm run lint

# ── Docker ────────────────────────────────────────────────────
docker-build: ## Build all Docker images
	docker compose build

docker-up: ## Start all services with Docker Compose
	cp -n .env.example .env 2>/dev/null || true
	docker compose up -d

docker-down: ## Stop all Docker services
	docker compose down

docker-logs: ## Tail logs from all services
	docker compose logs -f

docker-reset: ## Stop containers and remove volumes
	docker compose down -v

# ── Cleanup ───────────────────────────────────────────────────
clean: ## Remove Python cache and build artifacts
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -name "*.pyc" -delete 2>/dev/null || true
	rm -rf frontend/dist frontend/node_modules/.vite
