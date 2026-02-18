import requests

def create_test_user():
    url = "http://localhost:8000/api/auth/register"
    headers = {"Content-Type": "application/json"}
    data = {
        "email": "user@example.com",
        "username": "testuser",
        "password": "user123"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("User created successfully: user@example.com / user123")
        elif response.status_code == 400 and "Email already registered" in response.text:
            print("User already exists: user@example.com / user123")
        else:
            print(f"Failed to create user: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    create_test_user()
