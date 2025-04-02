import type {NextConfig} from "next";

const GITHUB_REPO = process.env.GITHUB_PAGES ? "ml-wasm" : undefined;

const nextConfig: NextConfig = {
	// output: 'standalone', これは動的なサイトを生成してしまうので間違い
	output: "export",
	basePath: GITHUB_REPO ? `/${GITHUB_REPO}` : undefined,
	assetPrefix: GITHUB_REPO ? `/${GITHUB_REPO}/` : undefined,
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
