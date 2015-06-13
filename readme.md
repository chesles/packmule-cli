# install

```sh
npm install --save-dev @packmule/cli
```

# what's this?

`packmule` is a tool for managing native web app releases ("single-page" apps).
It lets you upload a new version and tag it with one of more channel names.
Each release is registered with whatever server is serving up your frontend
code (you'll have to implement a simple API route to handle these
registrations).

When users come to your site, depending on who they are or what app channel
they are subscribed to, you can serve up the appropriate release of your app.

This allows you to:

- deploy a new version of your front-end code and test it out before users see it
- do A/B split testing with different UI concepts
- whip together a proof of concept in a topic branch and share it with your team on a
  branch-specific release channel
- etc.

This is build chain agnostic - use whatever your favorite tools are to build
your scripts & assets

# getting started

Upload a new release:

```sh
$ packmule release build/ --channel feature-abc123
```

Serve up a release locally for testing/development:

```sh
$ packmule serve build/
```

Get more help:

```sh
$ packmule help
```
