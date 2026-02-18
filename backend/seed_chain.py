import requests
import json
import time

BASE_URL = "http://localhost:8000/api/auth"

def register_user(username, email, password, referral_code=None):
    payload = {
        "username": username,
        "email": email,
        "password": password,
        "role": "user"
    }
    if referral_code:
        payload["referral_code"] = referral_code
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=payload)
        if response.status_code == 200:
            print(f"✅ Registered {username} ({email})")
            return response.json()
        elif response.status_code == 400 and "Email already registered" in response.text:
             # Try to login to get the referral code if user exists
             print(f"⚠️ User {username} exists. Logging in...")
             return login_user(email, password)
        else:
            print(f"❌ Failed to register {username}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def login_user(email, password):
    payload = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(f"{BASE_URL}/login", json=payload)
        if response.status_code == 200:
            data = response.json()
            # The login response has 'user' object which should have referral_code
            # If not, we might need to fetch /me
            if 'user' in data and 'referral_code' in data['user']:
                 return data['user']
            else:
                 # Fetch /me
                 token = data['access_token']
                 headers = {"Authorization": f"Bearer {token}"}
                 me_res = requests.get(f"{BASE_URL}/me", headers=headers)
                 if me_res.status_code == 200:
                     return me_res.json()
    except Exception as e:
        print(f"❌ Login Error: {e}")
    return None

def seed_chain():
    print("🚀 Starting MLM Chain Seeding...")
    
    # 1. Start with Super Admin code
    current_referrer_code = "SUPERADMIN" # Assumed from main.py
    
    users_created = []

    for i in range(1, 21):
        username = f"chain_user_{i}"
        email = f"user{i}@chain.com"
        password = "password123"
        
        print(f"\n--- Processing User {i} ---")
        print(f"Referrer Code: {current_referrer_code}")
        
        user_data = register_user(username, email, password, current_referrer_code)
        
        if user_data:
            users_created.append(user_data)
            # update referrer code for the NEXT user to be THIS user's code
            if user_data.get("referral_code"):
                current_referrer_code = user_data["referral_code"]
            else:
                print("❌ Warning: No referral code found for this user. Chain might break.")
                break
        else:
            print("❌ Stopping chain due to error.")
            break
            
        time.sleep(0.5) # small delay

    print(f"\n✅ Seeding Complete. Created/Verified {len(users_created)} users.")
    print("Login Credentials:")
    for u in users_created:
        print(f"  {u['email']} / password123 (Ref Code: {u['referral_code']})")

if __name__ == "__main__":
    seed_chain()
