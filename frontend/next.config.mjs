const GITHUB_REPO = process.env.GITHUB_PAGES ? "ml-wasm" : undefined;
// next.config.tsはworkflowが読み込めない。mjsが回避策
const nextConfig = {
	// output: 'standalone', これは動的なサイトを生成してしまうので間違いでexportが正解。そしてmjsにするならばexportも書かなくてよい
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
