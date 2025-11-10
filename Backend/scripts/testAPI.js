import axios from "axios";

const testAPI = async () => {
  try {
    console.log("Testing login API endpoint...");
    console.log("URL: http://localhost:5000/api/auth/login");
    console.log("Email: owner@example.com");
    console.log("Password: admin123\n");

    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: "owner@example.com",
      password: "admin123"
    });

    console.log("✅ Login successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Login failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Message:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the backend server running?");
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
  }
};

testAPI();

