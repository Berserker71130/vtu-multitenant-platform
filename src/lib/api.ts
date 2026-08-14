const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";
const ENABLE_MOCK_FALLBACK = true; // Toggle this to false when live backend is fixed

interface FetchOptions extends RequestInit {
  tenantSlug?: string;
  adminToken?: string;
}

// In-memory mock database store (persists for session)
const MOCK_USERS_DB = [
  {
    id: "usr_apex_001",
    email: "user@apex.com",
    password: "password123",
    api_key: "sk_live_apex_998877665544332211",
    name: "Apex Telecome Admin",
    store_slug: "apex-telecom",
  },
  {
    id: "usr_power_002",
    email: "user@power.com",
    password: "password123",
    api_key: "sk_live_power_112233445566778899",
    name: "Power Connect Admin",
    store_slug: "power-connect",
  },
];

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    tenantSlug,
    adminToken,
    headers: customHeaders,
    ...restOptions
  } = options;

  const formattedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  // -------------------------------------------------------------
  // MOCK INTERCEPTOR (Bypasses Broken Provider Backend)
  // -------------------------------------------------------------
  if (ENABLE_MOCK_FALLBACK) {
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Handle Mock Login
    if (formattedEndpoint === "/auth/login" && restOptions.method === "POST") {
      const body = JSON.parse((restOptions.body as string) || "{}");
      const foundUser = MOCK_USERS_DB.find(
        (u) => u.email.toLowerCase() === body.email?.toLowerCase(),
      );

      // If registered email exists OR fallback credentials entered
      if (foundUser) {
        return {
          success: true,
          message: "Login successful",
          data: {
            id: foundUser.id,
            email: foundUser.email,
            api_key: foundUser.api_key,
            store_slug: foundUser.store_slug,
          },
        } as T;
      }

      // Default mock login success for any new user test
      return {
        success: true,
        message: "Login successful (Mock Mode)",
        data: {
          id: `usr_${Date.now()}`,
          email: body.email || "demo@reseller.com",
          api_key: `sk_test_mock_${Math.random().toString(36).substring(2)}`,
          store_slug: "apex-telecom",
        },
      } as T;
    }

    // Handle Mock Registration
    if (
      formattedEndpoint === "/auth/register" &&
      restOptions.method === "POST"
    ) {
      const body = JSON.parse((restOptions.body as string) || "{}");
      const newUserId = `usr_${Date.now()}`;
      const newApiKey = `sk_live_mock_${Math.random().toString(36).substring(2)}`;

      MOCK_USERS_DB.push({
        id: newUserId,
        email: body.email,
        password: body.password || "password123",
        api_key: newApiKey,
        name: body.business_name || body.name || "New Merchant",
        store_slug: body.store_slug || "apex-telecom",
      });

      return {
        success: true,
        message: "Account registered successfully",
        data: {
          id: newUserId,
          email: body.email,
          api_key: newApiKey,
          store_slug: body.store_slug || "apex-telecom",
        },
      } as T;
    }
  }

  // -------------------------------------------------------------
  // REAL API CALL (Active when ENABLE_MOCK_FALLBACK = false)
  // -------------------------------------------------------------
  const userToken =
    typeof window !== "undefined"
      ? localStorage.getItem("vtu_auth_token")
      : null;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  });

  const tokenToUse = userToken || adminToken;
  if (tokenToUse) {
    headers.set("Authorization", `Bearer ${tokenToUse}`);
  }

  if (tenantSlug) {
    headers.set("X-Tenant-Slug", tenantSlug);
  }

  const response = await fetch(`${API_BASE_URL}${formattedEndpoint}`, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      errorData.message ||
      `API Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return response.json();
}
