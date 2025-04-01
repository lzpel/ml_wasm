generate:
	cd frontend && npm install
	cargo install wasm-pack
	@: rustup default 1.81
	wasm-pack build . -d ../lib
	rustup default stable
run:
	cd frontend && npm run dev
create-next-app:
	npx create-next-app@latest frontend --no-tailwind --no-turbopack --yes