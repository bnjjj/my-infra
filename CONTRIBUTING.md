# My infra

> Mobile application for OVH created with [Ionic 2](http://ionicframework.com/docs/v2/) & [Angular 2](https://angular.io/).

## Installation

:warning: Use Node.js version `>=6.0` and use the latest release of Ionic CLI (```npm install -g ionic``` even if you already have the Ionic v2 CLI installed).

```bash
$ git clone https://github.com/bnjjj/my-infra.git
$ cd my-infra
$ npm install
```

## Run

```bash
$ npm run start # or you can use `ionic serve --lab`
```

### Troubleshooting

We recommand you to install the [Allow-Control-Allow-Oirigin:*](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=chrome-ntp-icon) extension.

This extension helps you to prevent this following error that you might notice into your console while you are trying to logged in:

```js
No 'Access-Control-Allow-Origin' header is present on the requested resource…
```

### Ionic cli

If you're not used to use Ionic, go on the [Ionic Documentation](http://ionicframework.com/docs/v2/).

### Creating an Issue

If you have a question about using the framework, please ask me on my [twitter](https://twitter.com/BnJ25) in order to have a personal access to our [https://my-infra.slack.com](slack).

If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/bnjjj/my-infra/issues?utf8=%E2%9C%93&q=is%3Aissue). You can search through existing issues to see if there is a similar one reported. Include closed issues as it may have been closed with a solution.

Next, [create a new issue](https://github.com/bnjjj/my-infra/issues/new) that thoroughly explains the problem. Please fill out the populated issue form before submitting the issue.

### Creating a Pull Request

We appreciate you taking the time to contribute! Before submitting a pull request, we ask that you please [create an issue](#creating-an-issue) that explains the bug or feature request and let us know that you plan on creating a pull request for it. If an issue already exists, please comment on that issue letting us know you would like to submit a pull request for it. This helps us to keep track of the pull request and make sure there isn't duplicated effort.

Looking for an issue to fix? Make sure to look through our issues with the [help wanted](https://github.com/bnjjj/my-infra/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label!

### Setup

1. Fork the repo.
2. Clone your fork.
3. Make a branch for your change.
4. Run `npm install` (make sure you have [Node.js](https://nodejs.org/en/) and [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) installed first).

### Commiting

1. Install Commitizen (add sudo if on OSX/Linux): `npm install -g commitizen`.
2. Use commitizen to commit instead of git commit: `git cz` or `git-cz`.
3. This will prompt you with questions and commit when you are finished.
4. Submit the Pull Request!

### License

By contributing your code to the bnjjj/my-infra GitHub Repository, you agree to license your contribution under the MIT license.
