generate: generate-wasm generate-frontend
	@: nothing
generate-wasm:
	cargo install wasm-pack
	rustup default 1.81
	wasm-pack build . -d ./frontend/output
	rustup default stable
generate-frontend:
	cd frontend && npm install
run:
	mkdir -p frontend/public/output
	cp -r input onnx frontend/public/output/
	cd frontend && npm run dev
tree:
	@: wasmコンパイルできない理由を探るのに便利
	cargo tree
create-next-app:
	npx create-next-app@latest frontend --no-tailwind --no-turbopack --yes