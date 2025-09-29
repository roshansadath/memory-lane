# Cache Invalidation Strategy

This document outlines the cache invalidation strategy implemented for user-specific data in the Memory Lane application.

## Problem

When users log out and different users log in, the "My Lanes" page would show cached data from the previous user until the page was manually refreshed. This was due to React Query caching user-specific data without proper invalidation.

## Solution

### 1. User-Specific Query Keys

The `useMyMemoryLanes` hook now includes the user ID in the query key:

```typescript
queryKey: [...queryKeys.lists(), 'my', user?.id, params]
```

This ensures that different users have completely separate cache entries.

### 2. Targeted Cache Invalidation

Instead of clearing the entire cache, we implement targeted invalidation that clears only user-specific data:

- Memory lanes lists
- Home page data  
- Tags with lanes
- "My Lanes" queries specifically
- Memory lane details
- Search results

### 3. Authentication State Management

The `AuthContext` now properly clears user-specific data when:

- User logs out
- User logs in (new user)
- User registration
- Token becomes invalid
- Authentication errors occur

## Implementation Details

### clearUserData Function

```typescript
const clearUserData = useCallback(() => {
  // Clear user-specific queries
  queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
  queryClient.invalidateQueries({ queryKey: queryKeys.homePage() });
  queryClient.invalidateQueries({ queryKey: queryKeys.tagsWithLanes() });
  // Clear all "My Lanes" queries (regardless of user ID)
  queryClient.removeQueries({ queryKey: [...queryKeys.lists(), 'my'] });
  // Clear all memory lane details
  queryClient.removeQueries({ queryKey: queryKeys.details() });
  // Clear any user-specific search results
  queryClient.removeQueries({ queryKey: ['memoryLanes', 'search'] });
}, [queryClient]);
```

### React Hook Dependencies

All functions are properly wrapped in `useCallback` with correct dependencies to avoid React Hook warnings and ensure proper re-rendering behavior.

## Benefits

1. **Automatic Refresh**: Users see their own data immediately when logging in
2. **Efficient Caching**: Only user-specific data is cleared, preserving non-user-specific data
3. **Better Performance**: User-specific query keys ensure proper cache isolation
4. **Robust Error Handling**: Cache is cleared even when authentication fails

## Testing

The implementation has been tested with multiple users to ensure:

- User A's data is not visible when User B logs in
- Cache is properly cleared on logout
- Fresh data is fetched for new users
- No stale data persists between user sessions
