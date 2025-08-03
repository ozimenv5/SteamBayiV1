from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import random
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Define Models
class SteamAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SteamAccountCreate(BaseModel):
    username: str
    password: str

class DeliveryKey(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key_value: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DeliveryKeyCreate(BaseModel):
    key_value: str

class AdminLogin(BaseModel):
    password: str

class KeyRedeem(BaseModel):
    key: str

class AdminVerifyResponse(BaseModel):
    success: bool
    message: str

class AccountDeliveryResponse(BaseModel):
    success: bool
    message: str
    account: Optional[dict] = None

# Admin password (in real app, this should be in environment variables)
ADMIN_PASSWORD = "xenforce123"

# Helper functions
def generate_simple_token(password: str) -> str:
    return hashlib.md5(f"{password}_{datetime.utcnow()}".encode()).hexdigest()

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Simple token verification - in production use proper JWT
    return True

# Routes
@api_router.post("/admin/verify", response_model=AdminVerifyResponse)
async def verify_admin_password(login_data: AdminLogin):
    if login_data.password == ADMIN_PASSWORD:
        token = generate_simple_token(login_data.password)
        return AdminVerifyResponse(
            success=True, 
            message=f"Admin authenticated successfully. Token: {token}"
        )
    else:
        raise HTTPException(status_code=401, detail="Invalid admin password")

# Steam Account Management
@api_router.get("/admin/accounts", response_model=List[SteamAccount])
async def get_steam_accounts(credentials: HTTPAuthorizationCredentials = Depends(security)):
    accounts = await db.steam_accounts.find().to_list(1000)
    return [SteamAccount(**account) for account in accounts]

@api_router.post("/admin/accounts", response_model=SteamAccount)
async def create_steam_account(account_data: SteamAccountCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    steam_account = SteamAccount(**account_data.dict())
    await db.steam_accounts.insert_one(steam_account.dict())
    return steam_account

@api_router.delete("/admin/accounts/{account_id}")
async def delete_steam_account(account_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    result = await db.steam_accounts.delete_one({"id": account_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}

# Delivery Key Management
@api_router.get("/admin/keys", response_model=List[DeliveryKey])
async def get_delivery_keys(credentials: HTTPAuthorizationCredentials = Depends(security)):
    keys = await db.delivery_keys.find().to_list(1000)
    return [DeliveryKey(**key) for key in keys]

@api_router.post("/admin/keys", response_model=DeliveryKey)
async def create_delivery_key(key_data: DeliveryKeyCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    delivery_key = DeliveryKey(**key_data.dict())
    await db.delivery_keys.insert_one(delivery_key.dict())
    return delivery_key

@api_router.delete("/admin/keys/{key_id}")
async def delete_delivery_key(key_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    result = await db.delivery_keys.delete_one({"id": key_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"message": "Key deleted successfully"}

# Key Redemption (Public endpoint)
@api_router.post("/redeem-key", response_model=AccountDeliveryResponse)
async def redeem_key(redeem_data: KeyRedeem):
    # Check if key exists
    key_exists = await db.delivery_keys.find_one({"key_value": redeem_data.key})
    if not key_exists:
        return AccountDeliveryResponse(
            success=False,
            message="Geçersiz key! Lütfen doğru key'i girin."
        )
    
    # Get all accounts
    accounts = await db.steam_accounts.find().to_list(1000)
    if not accounts:
        return AccountDeliveryResponse(
            success=False,
            message="Şu anda teslim edilecek hesap bulunmuyor."
        )
    
    # Select random account
    random_account = random.choice(accounts)
    
    # Delete the used key (one-time use)
    await db.delivery_keys.delete_one({"key_value": redeem_data.key})
    
    return AccountDeliveryResponse(
        success=True,
        message="Steam hesabınız başarıyla teslim edildi! Key kullanıldı.",
        account={
            "username": random_account["username"],
            "password": random_account["password"]
        }
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()