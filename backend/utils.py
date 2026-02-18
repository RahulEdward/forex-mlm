import secrets
import string

def generate_referral_code(length=8):
    """Generate a secure random alphanumeric referral code."""
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))
