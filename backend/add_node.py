
import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def create_user_under_referrer(referrer_code, username, email):
    # This endpoint creates a new user
    url = f"{BASE_URL}/register" 
    payload = {
        "username": username,
        "email": email,
        "password": "password123",
        "referral_code": referrer_code,
        "role": "user"
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            user = response.json()
            print(f"✅ Success! Created user '{username}' under referrer '{referrer_code}'")
            print(f"Details: ID={user.get('id')}, Code={user.get('referral_code')}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Target: Add under chain_user_1 (SQIR7ZI9)
    # New user details
    new_username = "sub_user_1"
    new_email = "sub1@example.com"
    referrer_code = "SQIR7ZI9"
    
    print(f"Creating {new_username} ({new_email}) under {referrer_code}...")
    create_user_under_referrer(referrer_code, new_username, new_email)
