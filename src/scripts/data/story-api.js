import CONFIG from "../config";

const API_PATHS = {
  REGISTRATION: `${CONFIG.BASE_URL}/register`,
  AUTHENTICATION: `${CONFIG.BASE_URL}/login`,
  STORY_DATA: `${CONFIG.BASE_URL}/stories`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(API_PATHS.REGISTRATION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const responseData = await response.json();
    return { 
      success: response.ok,
      message: responseData.message,
      data: responseData 
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to connect to server",
      error: error.message
    };
  }
};

export const authenticateUser = async (credentials) => {
  try {
    const response = await fetch(API_PATHS.AUTHENTICATION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        failed: true,
        message: data.message || "Authentication failed",
      };
    }

    return {
      failed: false,
      authResult: data.loginResult,
    };
  } catch (error) {
    return {
      failed: true,
      message: "Network error occurred",
    };
  }
};

export const fetchStories = async (authToken) => {
  try {
    const response = await fetch(API_PATHS.STORY_DATA, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("API Response:", data);
    
    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Data loading failed",
        stories: []
      };
    }

    return {
      error: false,
      stories: data.listStory || data.stories || [],
      message: data.message
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      error: true,
      message: error.message,
      stories: []
    };
  }
};

export const submitStory = async (formData, authToken) => {
  try {
    const response = await fetch(API_PATHS.STORY_DATA, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || (response.ok ? "Success" : "Failed"),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export async function subscribePushNotification(subscription, token) {
  const subscriptionJson = subscription.toJSON();

  const payload = {
    endpoint: subscriptionJson.endpoint,
    keys: {
      p256dh: subscriptionJson.keys.p256dh,
      auth: subscriptionJson.keys.auth,
    },
  };

  const response = await fetch(API_PATHS.SUBSCRIBE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function unsubscribePushNotification(endpoint, token) {
  try {
    const response = await fetch(API_PATHS.SUBSCRIBE, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Gagal melakukan unsubscribe",
      };
    }

    return {
      error: false,
      data: data.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message || "Terjadi kesalahan jaringan",
    };
  }
}