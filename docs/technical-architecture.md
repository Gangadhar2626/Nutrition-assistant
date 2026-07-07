# Technical Architecture

## Layered Architecture

```mermaid
flowchart TB
    subgraph Frontend
      P1[Pages]
      P2[Components]
      P3[Context]
      P4[Services]
    end

    subgraph Backend
      B1[Routes]
      B2[Controllers]
      B3[Middleware]
      B4[Models]
      B5[Utils]
    end

    subgraph Data
      D1[(MongoDB Atlas)]
    end

    P4 --> B1
    B1 --> B2
    B2 --> B4
    B2 --> B3
    B4 --> D1
```

## Technology Stack

- **Client**: React 19, Vite, React Router, Axios, Bootstrap, Chart.js
- **Server**: Node.js, Express, Mongoose, JWT, bcrypt
- **Data**: MongoDB Atlas
