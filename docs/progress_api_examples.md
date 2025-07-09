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

## Comprehensive Progress Endpoint

### Get comprehensive progress with metrics

```javascript
// GET /api/progress?startDate=2025-06-01T00:00:00Z&endDate=2025-07-08T23:59:59Z

// Response (200 OK)
{
  "weightData": {
    "history": [
      {
        "_id": "60e7a3d2c2f2c13a7c23a4c1",
        "date": "2025-06-05T08:00:00Z",
        "weight": 175.5
      },
      {
        "_id": "60e7a3e5c2f2c13a7c23a4c2",
        "date": "2025-06-20T07:45:00Z",
        "weight": 174.2
      },
      {
        "_id": "60e7a3f1c2f2c13a7c23a4c3",
        "date": "2025-07-01T08:15:00Z",
        "weight": 173.5
      }
    ],
    "metrics": {
      "basicStats": {
        "totalEntries": 3,
        "averageWeight": 174.4,
        "minWeight": 173.5,
        "maxWeight": 175.5,
        "totalChange": -2.0,
        "currentWeight": 173.5,
        "startingWeight": 175.5
      },
      "trends": {
        "weeklyChangeRate": -0.77
      },
      "goalTracking": {
        "hasGoal": true,
        "desiredWeight": 170,
        "currentWeight": 173.5,
        "distanceToGoal": 3.5,
        "estimatedWeeksToGoal": 4.5,
        "percentageAchieved": 36.4
      }
    }
  },
  "workoutData": {
    "history": [
      {
        "_id": "60e7a3b9c2f2c13a7c23a4b5",
        "date": "2025-06-10T08:30:00Z",
        "workoutId": "monday_cardio",
        "notes": "Completed full cardio routine"
      },
      {
        "_id": "60e7a3c1c2f2c13a7c23a4b6",
        "date": "2025-06-12T18:30:00Z",
        "workoutId": "wednesday_strength",
        "notes": "Completed strength training"
      },
      {
        "_id": "60e7a3d1c2f2c13a7c23a4b7",
        "date": "2025-06-13T17:30:00Z",
        "workoutId": "friday_hiit",
        "notes": "Completed HIIT session"
      },
      {
        "_id": "60e7a3e2c2f2c13a7c23a4b8",
        "date": "2025-06-17T07:30:00Z",
        "workoutId": "tuesday_yoga",
        "notes": "Completed yoga session"
      }
    ],
    "metrics": {
      "frequency": {
        "totalWorkouts": 4,
        "workoutsPerWeek": 1.4,
        "daysTracked": 20,
        "longestStreak": 2
      },
      "mostRecent": {
        "_id": "60e7a3e2c2f2c13a7c23a4b8",
        "date": "2025-06-17T07:30:00Z",
        "workoutId": "tuesday_yoga",
        "notes": "Completed yoga session"
      }
    }
  },
  "dateRange": {
    "startDate": "2025-06-01T00:00:00.000Z",
    "endDate": "2025-07-08T23:59:59.000Z"
  }
}
```
