generate: generate-wasm generate-frontend generate-public
	@: nothing
generate-wasm:
	cargo install wasm-pack
	@: 昔は1.81でないと動かなかった
	@: rustup default 1.81
	wasm-pack build . -d ./frontend/output
	@: rustup default stable
generate-frontend:
	cd frontend && npm install
generate-public:
	mkdir -p frontend/public/output
	cp -rf input onnx frontend/public/output/
generate-onnx:
	cd onnx && pipenv install
	cd onnx && pipenv run yolo.py
run:
	cd frontend && npm run dev
tree:
	@: wasmコンパイルできない理由を探るのに便利
	cargo tree
create-next-app:
	npx create-next-app@latest frontend --no-tailwind --no-turbopack --yes