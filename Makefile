generate:
	cd frontend && npm install
	cargo install wasm-pack
	@: rustup default 1.81
	wasm-pack build . -d ./output_wasm
	rustup default stable
run:
	cd frontend && npm run dev
tree:
	@: wasmコンパイルできない理由を探るのに便利
	cargo tree
create-next-app:
	npx create-next-app@latest frontend --no-tailwind --no-turbopack --yes