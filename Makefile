generate:
	cd frontend && npm install
	cargo install wasm-pack
	rustup default 1.81
	wasm-pack build . -d ./frontend/output
	rustup default stable
run:
	mkdir -p frontend/public/output
	cp -r data frontend/public/output/
	cd frontend && npm run dev
tree:
	@: wasmコンパイルできない理由を探るのに便利
	cargo tree
create-next-app:
	npx create-next-app@latest frontend --no-tailwind --no-turbopack --yes