# SSL Certificate Monitor

> Monitor SSL certificates and get alerts before they expire

**Demo**: https://ssl-certificate-monitor.autocompany.workers.dev

## Features

- Check SSL certificate expiry dates
- View certificate details (issuer, algorithm, SANs)
- RESTful API for programmatic access
- Web UI for manual checks
- No signup required

## API

### Check Certificate

```bash
GET /api/check?domain=example.com
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "domain": "example.com",
    "subject": "CN=example.com",
    "issuer": "CN=Let's Encrypt Authority X3",
    "notBefore": "2024-01-01T00:00:00.000Z",
    "notAfter": "2024-04-01T00:00:00.000Z",
    "daysUntilExpiry": 90,
    "isValid": true,
    "isExpired": false,
    "isExpiringSoon": false,
    "signatureAlgorithm": "SHA256-RSA",
    "subjectAltNames": ["example.com", "www.example.com"],
    "checkedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```

## Tech Stack

- Cloudflare Workers
- TypeScript
- Tailwind CSS (via CDN)

## License

MIT
