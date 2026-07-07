# ER Diagram

```mermaid
erDiagram
    USER ||--o{ MEALPLAN : creates
    USER ||--o{ MEALPLAN : assigned_to
    USER ||--o{ PROGRESS : logs

    USER {
      string _id
      string name
      string email
      string password
      string role
      boolean isApproved
      datetime createdAt
    }

    MEALPLAN {
      string _id
      string title
      string description
      string dietitian
      string assignedTo
      number dailyCalories
      datetime createdAt
    }

    PROGRESS {
      string _id
      string user
      date entryDate
      number calories
      number protein
      number carbs
      number fat
      number weight
      datetime createdAt
    }
```

## Entity Summary

- **User**: Admin, Dietitian, and User identities with role-based permissions.
- **MealPlan**: Dietitian-authored plans optionally assigned to clients.
- **Progress**: Daily nutrition and weight logs entered by end users.
