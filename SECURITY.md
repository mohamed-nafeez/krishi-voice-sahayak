# Security Documentation

## Security Measures Implemented

### 1. Input Validation
- **express-validator**: Validates all API endpoints
- **Sanitization**: Removes harmful content and limits input length
- **Type checking**: Ensures correct data types for all parameters
- **Pattern matching**: City names restricted to safe characters only

### 2. Rate Limiting
- **General Rate Limit**: 100 requests per 15 minutes per IP
- **API Rate Limit**: 50 API calls per 15 minutes per IP
- **Prevents**: DoS attacks and API abuse

### 3. CORS Configuration
- **Development**: Allows localhost origins
- **Production**: Restricted to specific domains (update in server.js)
- **Methods**: Only GET and POST allowed
- **Headers**: Limited to Content-Type and Authorization

### 4. Security Headers (Helmet.js)
- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information

### 5. Error Handling
- **Production**: Generic error messages to prevent information disclosure
- **Development**: Detailed errors for debugging
- **Logging**: Errors logged for monitoring

### 6. Data Protection
- **Payload Limits**: Request body limited to 10MB
- **Input Sanitization**: All user inputs cleaned and validated
- **Encoding**: URL parameters properly encoded

## Environment Variables

### Required (Production)
```bash
GEMINI_API_KEY=your_actual_api_key
WEATHER_API_KEY=your_weather_api_key
NODE_ENV=production
PORT=3001
```

### Security Checklist Before Deployment

- [ ] Update CORS origins to your actual domain
- [ ] Set NODE_ENV=production
- [ ] Ensure API keys are properly secured
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Review and test all endpoints
- [ ] Perform security audit

## API Rate Limits

| Endpoint | Limit | Window |
|----------|--------|---------|
| All endpoints | 100 requests | 15 minutes |
| API endpoints | 50 requests | 15 minutes |

## Input Validation Rules

| Parameter | Rules |
|-----------|-------|
| query | String, 1-1000 chars, no scripts |
| language | Must be valid language code |
| city | String, 1-100 chars, letters/spaces/hyphens only |
| lat/lon | Float, valid coordinate ranges |

## Security Headers

The application includes the following security headers:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: same-origin
- X-Download-Options: noopen
- X-Permitted-Cross-Domain-Policies: none

## Vulnerability Reporting

If you discover a security vulnerability, please report it to the development team immediately.
