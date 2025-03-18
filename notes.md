# PostgreSQL-Specific Features

This document outlines PostgreSQL-specific features that you can use in your project with PGlite that aren't available in SQLite.

## Full-Text Search (FTS)

PostgreSQL offers powerful full-text search capabilities that go beyond simple LIKE queries, providing language-aware searching with ranking.

```sql
-- Add a tsvector column that automatically processes your text data
ALTER TABLE todos_table ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('english', todo)) STORED;

-- Create a GIN index for faster searching
CREATE INDEX todos_search_idx ON todos_table USING GIN (search_vector);

-- Search with relevance ranking
SELECT id, todo, date, 
       ts_rank(search_vector, to_tsquery('english', 'important & task')) as rank
FROM todos_table 
WHERE search_vector @@ to_tsquery('english', 'important & task')
ORDER BY rank DESC;
```

Full-text search allows for more natural language queries, handling stemming (finding variations of words), stop words, and ranking results by relevance.

## Array Data Types

PostgreSQL supports array data types, allowing you to store multiple values in a single column.

```sql
-- Add an array column to store tags
ALTER TABLE todos_table ADD COLUMN tags text[];

-- Insert with arrays
INSERT INTO todos_table (todo, tags) 
VALUES ('Buy groceries', ARRAY['shopping', 'food', 'household']);

-- Update by adding to an array
UPDATE todos_table 
SET tags = array_append(tags, 'urgent')
WHERE id = 1;

-- Query by array contents
SELECT * FROM todos_table WHERE 'shopping' = ANY(tags);

-- Find todos with multiple specific tags
SELECT * FROM todos_table WHERE tags @> ARRAY['shopping', 'urgent'];
```

Arrays are useful for storing related items like tags, categories, or any collection of values that belong together.

## JSON/JSONB Operations

PostgreSQL provides robust support for JSON data, allowing for flexible schema designs and complex data structures.

```sql
-- Add a JSONB column for metadata
ALTER TABLE todos_table ADD COLUMN metadata JSONB;

-- Store structured data
UPDATE todos_table 
SET metadata = '{
  "priority": "high",
  "category": "work",
  "deadline": "2024-03-20",
  "subtasks": ["research", "documentation", "implementation"]
}'::jsonb 
WHERE id = 1;

-- Query JSON fields with the -> operator (returns JSON) 
-- or ->> operator (returns text)
SELECT * FROM todos_table WHERE metadata->>'priority' = 'high';

-- Check for the existence of a key
SELECT * FROM todos_table WHERE metadata ? 'deadline';

-- Query nested arrays
SELECT * FROM todos_table 
WHERE metadata->'subtasks' @> '"research"'::jsonb;

-- Update a specific field in the JSON
UPDATE todos_table
SET metadata = jsonb_set(metadata, '{priority}', '"medium"', true)
WHERE id = 1;
```

JSONB is especially useful for dynamic data structures or when you need to store data that doesn't fit neatly into a relational model.

## Window Functions

Window functions perform calculations across a set of rows that are related to the current row, allowing for complex analytical queries.

```sql
-- Get todos with their creation rank by date
SELECT id, todo, date,
       RANK() OVER (ORDER BY date DESC) as creation_rank
FROM todos_table;

-- Calculate a running count of todos by day
SELECT 
    id, 
    todo, 
    date, 
    COUNT(*) OVER (PARTITION BY DATE_TRUNC('day', date) ORDER BY date) as daily_count
FROM todos_table;

-- Find the time difference between consecutive todos
SELECT 
    id, 
    todo, 
    date,
    date - LAG(date) OVER (ORDER BY date) as time_since_previous
FROM todos_table;

-- Percentile rank of todos by creation date
SELECT 
    id, 
    todo, 
    date,
    PERCENT_RANK() OVER (ORDER BY date) as percentile
FROM todos_table;
```

Window functions are powerful for analytics, ranking, and understanding patterns in your data without the need for complex self-joins.

## Complex Date/Time Operations

PostgreSQL offers extensive date and time manipulation functions.

```sql
-- Extract specific parts of timestamps
SELECT 
    id,
    todo, 
    date,
    EXTRACT(DOW FROM date) as day_of_week,
    EXTRACT(HOUR FROM date) as hour_of_day,
    EXTRACT(WEEK FROM date) as week_number
FROM todos_table;

-- Truncate timestamps to specific granularity
SELECT 
    DATE_TRUNC('day', date) as day,
    COUNT(*) as todos_per_day
FROM todos_table
GROUP BY DATE_TRUNC('day', date)
ORDER BY day;

-- Find todos from last week
SELECT * FROM todos_table 
WHERE date > NOW() - INTERVAL '1 week';

-- Calculate age between dates
SELECT 
    id, 
    todo,
    date,
    AGE(NOW(), date) as age
FROM todos_table;

-- Generate a series of dates
SELECT generate_series(
  DATE_TRUNC('week', CURRENT_DATE),
  DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days',
  INTERVAL '1 day'
) as calendar_day;
```

These functions are useful for analyzing time-based patterns, reporting, and working with calendar data.

## Common Table Expressions (CTEs)

CTEs provide a way to write auxiliary statements for use in a larger query, making complex queries more readable and maintainable.

```sql
-- Basic CTE to analyze daily todo counts
WITH daily_todos AS (
    SELECT 
        DATE_TRUNC('day', date) as day,
        COUNT(*) as todo_count
    FROM todos_table
    GROUP BY DATE_TRUNC('day', date)
)
SELECT * FROM daily_todos WHERE todo_count > 5;

-- Recursive CTE to generate a date series
WITH RECURSIVE date_series AS (
    SELECT CURRENT_DATE as date
    UNION ALL
    SELECT date + 1 FROM date_series WHERE date < CURRENT_DATE + 14
)
SELECT date FROM date_series;

-- Multiple CTEs for complex analysis
WITH todo_tags AS (
    SELECT id, unnest(tags) as tag
    FROM todos_table
    WHERE tags IS NOT NULL
),
tag_counts AS (
    SELECT tag, COUNT(*) as usage_count
    FROM todo_tags
    GROUP BY tag
)
SELECT * FROM tag_counts ORDER BY usage_count DESC;
```

CTEs make SQL more readable and modular, allowing you to break down complex queries into manageable parts.

