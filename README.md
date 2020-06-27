# whereto

A Chrome Extension that lists domains a page is sending a request to.

## how to build

```
$ ./prepare-package.sh
```

The command above all necessary outputs in `dist` directory. Use this `dist` directory to load the extension locally when developing.

The following command monitors file changes, and it executes the `prepare-package.sh`:

```
$ ./monitor-file-changes.sh
```

`monitor-file-changes.sh` requires [fswatch](https://github.com/emcrisostomo/fswatch).
