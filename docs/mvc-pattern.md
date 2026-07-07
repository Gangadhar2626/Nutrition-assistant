# MVC Pattern

The backend follows an MVC-style separation using **Routes + Controllers + Models**.

```mermaid
flowchart LR
    V[View - React UI] --> R[Express Routes]
    R --> C[Controllers]
    C --> M[Mongoose Models]
    M --> DB[(MongoDB)]
```

## Mapping in This Project

- **View**: React pages/components in `client/src`
- **Controller**: Request handlers in `server/controllers`
- **Model**: Mongoose schemas in `server/models`
- **Routing layer**: Endpoint definitions in `server/routes`
