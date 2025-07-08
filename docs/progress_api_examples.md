# Progress Tracking API Examples

## Workout History Endpoints

### Add a new workout completion

```javascript
// POST /api/progress/workout
// Request Body
{
  "date": "2025-07-05T08:30:00Z",
  "workoutId": "monday_cardio",
  "notes": "Completed full cardio routine"
}

// Response (201 Created)
{
  "message": "Workout entry created successfully",
  "entry": {
    "_id": "60e7a3b9c2f2c13a7c23a4b5",
    "date": "2025-07-05T08:30:00Z",
    "workoutId": "monday_cardio",
    "notes": "Completed full cardio routine"
  }
}
```

### Update an existing workout entry

```javascript
// PUT /api/progress/workout/60e7a3b9c2f2c13a7c23a4b5
// Request Body
{
  "date": "2025-07-05T09:15:00Z",
  "notes": "Completed full cardio routine with extra 15 minutes"
}

// Response (200 OK)
{
  "message": "Workout entry updated successfully",
  "entry": {
    "_id": "60e7a3b9c2f2c13a7c23a4b5",
    "date": "2025-07-05T09:15:00Z",
    "workoutId": "monday_cardio",
    "notes": "Completed full cardio routine with extra 15 minutes"
  }
}
```

### Delete a workout entry

```javascript
// DELETE /api/progress/workout/60e7a3b9c2f2c13a7c23a4b5

// Response (200 OK)
{
  "message": "Workout entry deleted successfully"
}
```

### Get workout history

```javascript
// GET /api/progress/workout-history?startDate=2025-07-01T00:00:00Z&endDate=2025-07-31T23:59:59Z

// Response (200 OK)
{
  "workoutHistory": [
    {
      "_id": "60e7a3b9c2f2c13a7c23a4b5",
      "date": "2025-07-05T09:15:00Z",
      "workoutId": "monday_cardio",
      "notes": "Completed full cardio routine with extra 15 minutes"
    },
    {
      "_id": "60e7a3c1c2f2c13a7c23a4b6",
      "date": "2025-07-07T18:30:00Z",
      "workoutId": "wednesday_strength",
      "notes": "Completed strength training"
    }
  ]
}
```

## Weight History Endpoints

### Add a new weight entry

```javascript
// POST /api/progress/weight
// Request Body
{
  "date": "2025-07-05T08:00:00Z",
  "weight": 175.5
}

// Response (201 Created)
{
  "message": "Weight entry created successfully",
  "entry": {
    "_id": "60e7a3d2c2f2c13a7c23a4c1",
    "date": "2025-07-05T08:00:00Z",
    "weight": 175.5
  }
}
```

### Update an existing weight entry

```javascript
// PUT /api/progress/weight/60e7a3d2c2f2c13a7c23a4c1
// Request Body
{
  "weight": 175.2
}

// Response (200 OK)
{
  "message": "Weight entry updated successfully",
  "entry": {
    "_id": "60e7a3d2c2f2c13a7c23a4c1",
    "date": "2025-07-05T08:00:00Z",
    "weight": 175.2
  }
}
```

### Delete a weight entry

```javascript
// DELETE /api/progress/weight/60e7a3d2c2f2c13a7c23a4c1

// Response (200 OK)
{
  "message": "Weight entry deleted successfully"
}
```

### Get weight history

```javascript
// GET /api/progress/weight-history

// Response (200 OK)
{
  "weightHistory": [
    {
      "_id": "60e7a3d2c2f2c13a7c23a4c1",
      "date": "2025-07-05T08:00:00Z",
      "weight": 175.2
    },
    {
      "_id": "60e7a3e5c2f2c13a7c23a4c2",
      "date": "2025-07-12T07:45:00Z",
      "weight": 174.8
    },
    {
      "_id": "60e7a3f1c2f2c13a7c23a4c3",
      "date": "2025-07-19T08:15:00Z",
      "weight": 173.5
    }
  ]
}
```
