
import requests
import json

BASE_URL = "http://localhost:8000/api"

def login():
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={"email": "superadmin@example.com", "password": "superadmin123"}) # Default credentials?
        if response.status_code == 200:
            return response.json()['access_token']
        print(f"Login failed: {response.text}")
    except Exception as e:
        print(f"Login error: {e}")
    return None

def test_get_tree():
    token = login()
    if not token:
        return

    print(f"Token obtained. Fetching tree...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/referral/admin/tree?depth=5", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Tree data length: {len(data)}")
            print(json.dumps(data[:3], indent=2)) # Print first 3
        else:
            print(f"Failed to fetch tree: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Error fetching tree: {e}")

if __name__ == "__main__":
    test_get_tree()
