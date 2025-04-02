import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	// output: 'standalone', これは動的なサイトを生成してしまうので間違い
	output: "export",
	webpack: (config, options) => {
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			syncWebAssembly: true,
			layers: true,
		};
		config.output.webassemblyModuleFilename = (options.isServer ? '../' : '') + 'static/wasm/webassembly.wasm';
		return config;
	}
};

export default nextConfig;
