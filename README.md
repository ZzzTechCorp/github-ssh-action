# Setup SSH - GitHub Action

[![Fail](https://github.com/ZzzTechCorp/github-ssh-action/actions/workflows/macos.yml/badge.svg)](https://github.com/ZzzTechCorp/github-ssh-action)
[![Fail](https://github.com/ZzzTechCorp/github-ssh-action/actions/workflows/ubuntu.yml/badge.svg)](https://github.com/ZzzTechCorp/github-ssh-action)

This action sets up your SSH key on  `macOS` and `Ubuntu` Environments

## Example usage

Setup for GitHub

```yml
name: Deployment

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: ZzzTechCorp/github-ssh-action@v1.0.0
      with:
        SSHKEY: ${{ secrets.SSH }} # ----- BEGIN RSA PRIVATE KEY----- ...
    - run: ssh -T git@github.com || true
```

Setup for your server

```yml
name: Deployment

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: ZzzTechCorp/github-ssh-action@v1.0.0
      with:
        ORIGIN: ${{ secrets.HOST }} # example.com || 8.8.8.8
        SSHKEY: ${{ secrets.SSH }} # ----- BEGIN RSA PRIVATE KEY----- ...
        NAME: production
        PORT: ${{ secrets.PORT }} # 3000
        USER: ${{ secrets.USER }} # admin
    - run: ssh production ls --help
```

## Inputs

| Key      | Value Information                                                                | Required |
|----------|----------------------------------------------------------------------------------|----------|
| `ORIGIN` | Where to log in, can be a **Domain** or **IP address**, defaults to `github.com` | **No**   |
| `SSHKEY` | Your SSH access key, it's better to store it on your repository secrets          | **Yes**  |
| `NAME`   | How you can refer to the SSH key in the next commands, defaults to `ORIGIN`      | **No**   |
| `PORT`   | The port that will be on the SSH config                                          | **No**   |
| `USER`   | The user that will be on the SSH config                                          | **No**   |

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`
