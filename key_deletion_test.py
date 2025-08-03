#!/usr/bin/env python3
"""
Focused test for automatic key deletion after redemption
"""

import requests
import json

# Backend URL from frontend/.env
BACKEND_URL = "https://880a56f3-4b8d-4fb1-b1c2-796b06eee3c3.preview.emergentagent.com/api"
ADMIN_PASSWORD = "xenforce123"

def test_key_deletion_scenario():
    """Test the complete key deletion scenario as requested"""
    print("🔍 TESTING AUTOMATIC KEY DELETION AFTER REDEMPTION")
    print("=" * 60)
    
    # Step 1: Admin login
    print("1️⃣ Admin girişi yapılıyor...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/admin/verify",
            json={"password": ADMIN_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data["message"].split("Token: ")[1]
            print("✅ Admin girişi başarılı!")
            
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        else:
            print("❌ Admin girişi başarısız!")
            return False
    except Exception as e:
        print(f"❌ Admin girişi hatası: {e}")
        return False
    
    # Step 2: Add a Steam account
    print("\n2️⃣ Steam hesabı ekleniyor...")
    try:
        account_data = {"username": "test_steam_user", "password": "test_steam_pass"}
        response = requests.post(
            f"{BACKEND_URL}/admin/accounts",
            json=account_data,
            headers=headers
        )
        
        if response.status_code == 200:
            account = response.json()
            print(f"✅ Steam hesabı eklendi: {account['username']}")
        else:
            print("❌ Steam hesabı eklenemedi!")
            return False
    except Exception as e:
        print(f"❌ Steam hesabı ekleme hatası: {e}")
        return False
    
    # Step 3: Add a delivery key
    print("\n3️⃣ Delivery key ekleniyor...")
    test_key = "TEST-KEY-DELETE-2025"
    try:
        key_data = {"key_value": test_key}
        response = requests.post(
            f"{BACKEND_URL}/admin/keys",
            json=key_data,
            headers=headers
        )
        
        if response.status_code == 200:
            key = response.json()
            print(f"✅ Key eklendi: {key['key_value']}")
        else:
            print("❌ Key eklenemedi!")
            return False
    except Exception as e:
        print(f"❌ Key ekleme hatası: {e}")
        return False
    
    # Step 4: Check key exists in list before redemption
    print("\n4️⃣ Key listesi kontrol ediliyor (kullanım öncesi)...")
    try:
        response = requests.get(f"{BACKEND_URL}/admin/keys", headers=headers)
        if response.status_code == 200:
            keys_before = response.json()
            key_exists = any(k.get("key_value") == test_key for k in keys_before)
            if key_exists:
                print(f"✅ Key listede mevcut ({len(keys_before)} toplam key)")
            else:
                print("❌ Key listede bulunamadı!")
                return False
        else:
            print("❌ Key listesi alınamadı!")
            return False
    except Exception as e:
        print(f"❌ Key listesi kontrol hatası: {e}")
        return False
    
    # Step 5: Redeem the key
    print("\n5️⃣ Key ile hesap alınıyor (POST /api/redeem-key)...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/redeem-key",
            json={"key": test_key},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("account"):
                account = data["account"]
                print(f"✅ Hesap başarıyla alındı!")
                print(f"   Username: {account['username']}")
                print(f"   Password: {account['password']}")
                print(f"   Mesaj: {data.get('message')}")
            else:
                print("❌ Hesap alınamadı!")
                return False
        else:
            print(f"❌ Key redemption başarısız: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Key redemption hatası: {e}")
        return False
    
    # Step 6: Try to use the same key again
    print("\n6️⃣ Aynı key tekrar kullanılmaya çalışılıyor...")
    try:
        response = requests.post(
            f"{BACKEND_URL}/redeem-key",
            json={"key": test_key},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if not data.get("success") and "Geçersiz key" in data.get("message", ""):
                print("✅ Kullanılmış key doğru şekilde reddedildi!")
                print(f"   Hata mesajı: {data.get('message')}")
            else:
                print("❌ Kullanılmış key reddedilmedi - BUG!")
                return False
        else:
            print(f"❌ İkinci key denemesi beklenmeyen sonuç: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ İkinci key denemesi hatası: {e}")
        return False
    
    # Step 7: Check key list - key should be deleted
    print("\n7️⃣ Key listesi kontrol ediliyor (kullanım sonrası)...")
    try:
        response = requests.get(f"{BACKEND_URL}/admin/keys", headers=headers)
        if response.status_code == 200:
            keys_after = response.json()
            key_exists = any(k.get("key_value") == test_key for k in keys_after)
            if not key_exists:
                print(f"✅ Key otomatik olarak silindi! ({len(keys_after)} toplam key kaldı)")
                print("🎉 OTOMATİK KEY SİLME ÖZELLİĞİ ÇALIŞIYOR!")
            else:
                print("❌ Key hala listede - otomatik silme çalışmıyor!")
                return False
        else:
            print("❌ Key listesi alınamadı!")
            return False
    except Exception as e:
        print(f"❌ Key listesi kontrol hatası: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ TÜM TESTLER BAŞARILI!")
    print("✅ Otomatik key silme özelliği doğru çalışıyor!")
    return True

if __name__ == "__main__":
    success = test_key_deletion_scenario()
    if success:
        print("\n🎯 SONUÇ: Özellik beklendiği gibi çalışıyor!")
    else:
        print("\n❌ SONUÇ: Özellikte problem var!")