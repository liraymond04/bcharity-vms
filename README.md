# BCharity VMS

## About BCharity

BCharity is a community-driven, decentralized, and permissionless public good Web3.0 built on blockchains.

## Contributing translations

If you would like to contribute translations, sign up for a Github account and visit the [inlang web editor](https://inlang.com/editor/github.com/liraymond04/bcharity-vms) for this repository.

## Project

The frontend is using [Next.js](https://nextjs.org/) to provide tooling and configuration for React.

The backend is using [Lens React Hooks SDK](https://docs.lens.xyz/docs/sdk-react-getting-started) to interact with the Lens Protocol.

The monorepo is using [Turborepo](https://turborepo.org/) and [pnpm workspaces](https://pnpm.io/workspaces) to link packages together.

- [./packages/ui](./packages/ui): Exports UI components that use TypeScript and Tailwind CSS and is compiled by SWC.
- [./packages/utils](./packages/utils): Exports utility functions that use TypeScript.

## Setup

Install the pnpm package manager,

```bash
npm i -g pnpm
```

And install the project dependencies,

```bash
pnpm i
```

Next, run `app` in development mode,

```bash
pnpm dev
```

The app should be up and running at http://localhost:3000.

## Adding dependencies

Add dependencies to the Next.js app,

```bash
pnpm i -w app [package-name]
```

## Contributors

Feel free to contribute to this project but please read the [Contributing Guidelines](CONTRIBUTING.md) before opening an issue or PR so you understand the branching strategy and local development environment.

<a href="https://github.com/liraymond04/bcharity-vms/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=liraymond04/bcharity-vms" />
</a>

## License

bcharity-vms is open-sourced software licensed under the © [AGPLv3](LICENSE).
