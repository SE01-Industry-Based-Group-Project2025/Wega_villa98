## GitHub Copilot Chat

- Extension Version: 0.28.0 (prod)
- VS Code: vscode/1.101.0
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.205.243.168 (116 ms)
- DNS ipv6 Lookup: Error (157 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (84 ms)
- Electron fetch (configured): HTTP 200 (472 ms)
- Node.js https: HTTP 200 (394 ms)
- Node.js fetch: HTTP 200 (469 ms)
- Helix fetch: HTTP 200 (567 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.21 (80 ms)
- DNS ipv6 Lookup: Error (90 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (8 ms)
- Electron fetch (configured): HTTP 200 (985 ms)
- Node.js https: HTTP 200 (1077 ms)
- Node.js fetch: HTTP 200 (1702 ms)
- Helix fetch: HTTP 200 (1652 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).