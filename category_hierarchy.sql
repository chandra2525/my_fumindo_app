WITH RECURSIVE category_hierarchy AS (
    -- Non-recursive term
    SELECT 
        category_id,
        category_name,
        parent_id,
        level,
        category_name::VARCHAR AS path  -- Cast ke VARCHAR secara eksplisit
    FROM category
    WHERE parent_id IS NULL
    UNION ALL
    -- Recursive term
    SELECT 
        c.category_id,
        c.category_name,
        c.parent_id,
        c.level,
        (ch.path || ' > ' || c.category_name)::VARCHAR AS path -- Cast ke VARCHAR secara eksplisit
    FROM category c
    INNER JOIN category_hierarchy ch ON c.parent_id = ch.category_id
)
SELECT * FROM category_hierarchy ORDER BY path;
