# Dynamic Token Management

This directory contains hooks for managing authentication tokens dynamically in the application.

## Hooks

### `useAuthToken()`
A hook that retrieves the current user's authentication token from the NextAuth session.

```tsx
import { useAuthToken } from "@/hooks";

const MyComponent = () => {
  const token = useAuthToken();
  
  // token will be null if user is not authenticated
  // token will contain the JWT token if user is authenticated
  
  return <div>Token: {token ? "Present" : "Not present"}</div>;
};
```

### `useApiService()`
A hook that provides an API service instance with automatically managed authentication tokens.

```tsx
import { useApiService } from "@/hooks";

const MyComponent = () => {
  const apiService = useApiService();
  
  const fetchData = async () => {
    try {
      // This will automatically include the user's token in the request
      const products = await apiService.getAllProducts();
      console.log(products);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  
  return <button onClick={fetchData}>Fetch Products</button>;
};
```

## How It Works

1. **Token Management**: The `useAuthToken` hook gets the token from the NextAuth session
2. **Automatic Updates**: The `useApiService` hook automatically updates the API service with the current token whenever the session changes
3. **Dynamic Headers**: The API service includes the token in request headers only when available

## Migration from Static Token

### Before (Static Token)
```tsx
// Old way - hardcoded token
import { servicesApi } from "@/Services/api";

const MyComponent = () => {
  const fetchData = async () => {
    const response = await servicesApi.getAllProducts();
    // Token was hardcoded in the service
  };
};
```

### After (Dynamic Token)
```tsx
// New way - dynamic token
import { useApiService } from "@/hooks";

const MyComponent = () => {
  const apiService = useApiService();
  
  const fetchData = async () => {
    const response = await apiService.getAllProducts();
    // Token is automatically managed based on user session
  };
};
```

## Benefits

- ✅ **Automatic Token Management**: No need to manually pass tokens
- ✅ **Session-Based**: Tokens are automatically updated when user logs in/out
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Easy Migration**: Simple to update existing components
- ✅ **Secure**: Tokens are managed through NextAuth session system
