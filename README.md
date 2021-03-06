# whereto

A Chrome Extension that lists domains a page is sending a request to.

![Example where whereto showing where https://rakuten.co.jp/ sends requests to](/docs/whereto-rakuten.png)


## how to install

Install it from [Chrome Web Store](https://chrome.google.com/webstore/detail/whereto/lclhbbcnkdpbajfmedglcbdikdmchaim).


## how to build

```
$ ./build-package.sh
```

The command above all necessary outputs in `dist` directory. Use this `dist` directory to load the extension locally when developing.

The following command monitors file changes, and it executes the `prepare-package.sh`:

```
$ ./monitor-file-changes.sh
```

`monitor-file-changes.sh` requires [fswatch](https://github.com/emcrisostomo/fswatch).


## how to create a package for distribution

```
$ ./build-package.sh
$ ./create-package.sh
```
