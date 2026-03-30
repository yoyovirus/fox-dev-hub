/**
 * Sample JSON data for demonstration purposes
 * Used across various tool pages as default example data
 */

export const SAMPLE_JSON_FORMATTER = `{
  "name": "Jane Doe",
  "age": 28,
  "skills": ["JavaScript", "React"],
  "address": {
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105"
  }
}`;

export const SAMPLE_JSON_VISUALIZER = `{
  "project": "FoX Dev Hub",
  "version": "1.0.0",
  "tools": [
    {
      "name": "JSON Formatter",
      "category": "JSON",
      "status": "active"
    },
    {
      "name": "Base64 Encoder",
      "category": "Base64",
      "status": "active"
    }
  ],
  "config": {
    "theme": "dark",
    "features": {
      "clientSide": true,
      "noStorage": true
    }
  }
}`;

export const SAMPLE_JSON_TO_TABLE = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Developer",
    "active": true
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "Designer",
    "active": true
  },
  {
    "id": 3,
    "name": "Bob Wilson",
    "email": "bob@example.com",
    "role": "Manager",
    "active": false
  }
]`;

export const SAMPLE_JSON_PATH_TESTER = `{
  "store": {
    "books": [
      {
        "title": "JavaScript Guide",
        "author": "John Smith",
        "price": 29.99,
        "category": "Programming"
      },
      {
        "title": "React Patterns",
        "author": "Jane Doe",
        "price": 34.99,
        "category": "Programming"
      },
      {
        "title": "Design Systems",
        "author": "Bob Wilson",
        "price": 39.99,
        "category": "Design"
      }
    ],
    "name": "Tech Books Store",
    "location": "San Francisco"
  }
}`;

export const SAMPLE_JSON_TYPE_GENERATOR = `{
  "user": {
    "id": "usr_123456",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "age": 28,
      "isVerified": true
    },
    "preferences": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": false,
        "sms": true
      }
    },
    "tags": ["developer", "premium", "early-adopter"],
    "metadata": {
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-12-20T14:22:00Z"
    }
  }
}`;

export const SAMPLE_JSON_RELATIONSHIP_VISUALIZER = `{
  "organization": {
    "name": "Tech Corp",
    "departments": [
      {
        "name": "Engineering",
        "teams": [
          {
            "name": "Frontend",
            "members": 12,
            "lead": "Alice Johnson"
          },
          {
            "name": "Backend",
            "members": 15,
            "lead": "Bob Smith"
          }
        ],
        "budget": 500000
      },
      {
        "name": "Design",
        "teams": [
          {
            "name": "UX",
            "members": 6,
            "lead": "Carol White"
          }
        ],
        "budget": 200000
      }
    ],
    "founded": 2020,
    "headquarters": "San Francisco, CA"
  }
}`;

// Export all samples as an object for easy access
export const SAMPLE_DATA = {
  formatter: SAMPLE_JSON_FORMATTER,
  visualizer: SAMPLE_JSON_VISUALIZER,
  toTable: SAMPLE_JSON_TO_TABLE,
  pathTester: SAMPLE_JSON_PATH_TESTER,
  typeGenerator: SAMPLE_JSON_TYPE_GENERATOR,
  relationshipVisualizer: SAMPLE_JSON_RELATIONSHIP_VISUALIZER,
} as const;

// Type for sample data keys
export type SampleDataKey = keyof typeof SAMPLE_DATA;
