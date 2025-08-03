#!/usr/bin/env python3
"""
Steam Account Delivery System - Backend API Tests
Tests all backend endpoints for the Steam account delivery system.
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend/.env
BACKEND_URL = "https://820bf613-2663-46eb-a912-c50c96e2b067.preview.emergentagent.com/api"

# Test data
ADMIN_PASSWORD = "xenforce123"
WRONG_PASSWORD = "wrongpassword"

# Test Steam accounts
TEST_ACCOUNTS = [
    {"username": "steamuser1", "password": "steampass1"},
    {"username": "steamuser2", "password": "steampass2"},
    {"username": "steamuser3", "password": "steampass3"}
]

# Test delivery keys
TEST_KEYS = [
    {"key_value": "STEAM-KEY-2025-001"},
    {"key_value": "STEAM-KEY-2025-002"},
    {"key_value": "STEAM-KEY-2025-003"}
]

class BackendTester:
    def __init__(self):
        self.admin_token = None
        self.created_accounts = []
        self.created_keys = []
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_admin_authentication_success(self):
        """Test successful admin authentication"""
        try:
            response = requests.post(
                f"{BACKEND_URL}/admin/verify",
                json={"password": ADMIN_PASSWORD},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "Token:" in data.get("message", ""):
                    # Extract token from message
                    token = data["message"].split("Token: ")[1]
                    self.admin_token = token
                    self.log_test(
                        "Admin Authentication Success",
                        True,
                        "Admin successfully authenticated with correct password",
                        {"token_received": True, "response": data}
                    )
                else:
                    self.log_test(
                        "Admin Authentication Success",
                        False,
                        "Response format incorrect",
                        {"response": data}
                    )
            else:
                self.log_test(
                    "Admin Authentication Success",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test(
                "Admin Authentication Success",
                False,
                f"Request failed: {str(e)}",
                {"error": str(e)}
            )

    def test_admin_authentication_failure(self):
        """Test failed admin authentication"""
        try:
            response = requests.post(
                f"{BACKEND_URL}/admin/verify",
                json={"password": WRONG_PASSWORD},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                self.log_test(
                    "Admin Authentication Failure",
                    True,
                    "Correctly rejected wrong password with 401",
                    {"response": response.json() if response.content else "No content"}
                )
            else:
                self.log_test(
                    "Admin Authentication Failure",
                    False,
                    f"Expected 401, got {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
        except Exception as e:
            self.log_test(
                "Admin Authentication Failure",
                False,
                f"Request failed: {str(e)}",
                {"error": str(e)}
            )

    def test_steam_account_crud(self):
        """Test Steam account CRUD operations"""
        if not self.admin_token:
            self.log_test(
                "Steam Account CRUD",
                False,
                "No admin token available for authentication",
                {}
            )
            return

        headers = {
            "Authorization": f"Bearer {self.admin_token}",
            "Content-Type": "application/json"
        }

        # Test CREATE accounts
        for i, account_data in enumerate(TEST_ACCOUNTS):
            try:
                response = requests.post(
                    f"{BACKEND_URL}/admin/accounts",
                    json=account_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    account = response.json()
                    self.created_accounts.append(account)
                    self.log_test(
                        f"Create Steam Account {i+1}",
                        True,
                        f"Account '{account_data['username']}' created successfully",
                        {"account_id": account.get("id"), "username": account.get("username")}
                    )
                else:
                    self.log_test(
                        f"Create Steam Account {i+1}",
                        False,
                        f"HTTP {response.status_code}: {response.text}",
                        {"status_code": response.status_code}
                    )
            except Exception as e:
                self.log_test(
                    f"Create Steam Account {i+1}",
                    False,
                    f"Request failed: {str(e)}",
                    {"error": str(e)}
                )

        # Test LIST accounts
        try:
            response = requests.get(
                f"{BACKEND_URL}/admin/accounts",
                headers=headers
            )
            
            if response.status_code == 200:
                accounts = response.json()
                if isinstance(accounts, list) and len(accounts) >= len(self.created_accounts):
                    self.log_test(
                        "List Steam Accounts",
                        True,
                        f"Retrieved {len(accounts)} accounts successfully",
                        {"account_count": len(accounts)}
                    )
                else:
                    self.log_test(
                        "List Steam Accounts",
                        False,
                        f"Expected list with at least {len(self.created_accounts)} accounts, got {accounts}",
                        {"response": accounts}
                    )
            else:
                self.log_test(
                    "List Steam Accounts",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test(
                "List Steam Accounts",
                False,
                f"Request failed: {str(e)}",
                {"error": str(e)}
            )

        # Test DELETE one account
        if self.created_accounts:
            account_to_delete = self.created_accounts[0]
            try:
                response = requests.delete(
                    f"{BACKEND_URL}/admin/accounts/{account_to_delete['id']}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    self.log_test(
                        "Delete Steam Account",
                        True,
                        f"Account '{account_to_delete['username']}' deleted successfully",
                        {"deleted_account_id": account_to_delete['id']}
                    )
                    # Remove from our tracking list
                    self.created_accounts.remove(account_to_delete)
                else:
                    self.log_test(
                        "Delete Steam Account",
                        False,
                        f"HTTP {response.status_code}: {response.text}",
                        {"status_code": response.status_code}
                    )
            except Exception as e:
                self.log_test(
                    "Delete Steam Account",
                    False,
                    f"Request failed: {str(e)}",
                    {"error": str(e)}
                )

    def test_delivery_key_crud(self):
        """Test Delivery Key CRUD operations"""
        if not self.admin_token:
            self.log_test(
                "Delivery Key CRUD",
                False,
                "No admin token available for authentication",
                {}
            )
            return

        headers = {
            "Authorization": f"Bearer {self.admin_token}",
            "Content-Type": "application/json"
        }

        # Test CREATE keys
        for i, key_data in enumerate(TEST_KEYS):
            try:
                response = requests.post(
                    f"{BACKEND_URL}/admin/keys",
                    json=key_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    key = response.json()
                    self.created_keys.append(key)
                    self.log_test(
                        f"Create Delivery Key {i+1}",
                        True,
                        f"Key '{key_data['key_value']}' created successfully",
                        {"key_id": key.get("id"), "key_value": key.get("key_value")}
                    )
                else:
                    self.log_test(
                        f"Create Delivery Key {i+1}",
                        False,
                        f"HTTP {response.status_code}: {response.text}",
                        {"status_code": response.status_code}
                    )
            except Exception as e:
                self.log_test(
                    f"Create Delivery Key {i+1}",
                    False,
                    f"Request failed: {str(e)}",
                    {"error": str(e)}
                )

        # Test LIST keys
        try:
            response = requests.get(
                f"{BACKEND_URL}/admin/keys",
                headers=headers
            )
            
            if response.status_code == 200:
                keys = response.json()
                if isinstance(keys, list) and len(keys) >= len(self.created_keys):
                    self.log_test(
                        "List Delivery Keys",
                        True,
                        f"Retrieved {len(keys)} keys successfully",
                        {"key_count": len(keys)}
                    )
                else:
                    self.log_test(
                        "List Delivery Keys",
                        False,
                        f"Expected list with at least {len(self.created_keys)} keys, got {keys}",
                        {"response": keys}
                    )
            else:
                self.log_test(
                    "List Delivery Keys",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test(
                "List Delivery Keys",
                False,
                f"Request failed: {str(e)}",
                {"error": str(e)}
            )

        # Test DELETE one key
        if self.created_keys:
            key_to_delete = self.created_keys[0]
            try:
                response = requests.delete(
                    f"{BACKEND_URL}/admin/keys/{key_to_delete['id']}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    self.log_test(
                        "Delete Delivery Key",
                        True,
                        f"Key '{key_to_delete['key_value']}' deleted successfully",
                        {"deleted_key_id": key_to_delete['id']}
                    )
                    # Remove from our tracking list
                    self.created_keys.remove(key_to_delete)
                else:
                    self.log_test(
                        "Delete Delivery Key",
                        False,
                        f"HTTP {response.status_code}: {response.text}",
                        {"status_code": response.status_code}
                    )
            except Exception as e:
                self.log_test(
                    "Delete Delivery Key",
                    False,
                    f"Request failed: {str(e)}",
                    {"error": str(e)}
                )

    def test_key_redemption_valid(self):
        """Test valid key redemption"""
        if not self.created_keys:
            self.log_test(
                "Valid Key Redemption",
                False,
                "No valid keys available for testing",
                {}
            )
            return

        # Use one of our created keys
        valid_key = self.created_keys[0]["key_value"]
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/redeem-key",
                json={"key": valid_key},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("account"):
                    account = data["account"]
                    if "username" in account and "password" in account:
                        self.log_test(
                            "Valid Key Redemption",
                            True,
                            "Successfully redeemed key and received account",
                            {
                                "key_used": valid_key,
                                "account_username": account["username"],
                                "message": data.get("message")
                            }
                        )
                    else:
                        self.log_test(
                            "Valid Key Redemption",
                            False,
                            "Account data incomplete",
                            {"response": data}
                        )
                else:
                    self.log_test(
                        "Valid Key Redemption",
                        False,
                        "Response indicates failure or missing account",
                        {"response": data}
                    )
            else:
                self.log_test(
                    "Valid Key Redemption",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test(
                "Valid Key Redemption",
                False,
                f"Request failed: {str(e)}",
                {"error": str(e)}
            )

    def test_key_redemption_invalid(self):
        """Test invalid key redemption"""
        invalid_key = "INVALID-KEY-12345"
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/redeem-key",
                json={"key": invalid_key},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if not data.get("success") and "Geçersiz key" in data.get("message", ""):
                    self.log_test(
                        "Invalid Key Redemption",
                        True,
                        "Correctly rejected invalid key with proper error message",
                        {"message": data.get("message")}
                    )
                else:
                    self.log_test(
                        "Invalid Key Redemption",
                        False,
                        "Should have failed with proper error message",
                        {"response": data}
                    )
            else:
                self.log_test(
                    "Invalid Key Redemption",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code}
                )
        except Exception as e:
            self.log_test(
                "Invalid Key Redemption",
                False,
                f"Request failed: {str(e)}",
                {"error": str(e)}
            )

    def test_key_redemption_no_accounts(self):
        """Test key redemption when no accounts are available"""
        if not self.admin_token:
            self.log_test(
                "Key Redemption No Accounts",
                False,
                "No admin token available to clear accounts",
                {}
            )
            return

        headers = {
            "Authorization": f"Bearer {self.admin_token}",
            "Content-Type": "application/json"
        }

        # First, delete all remaining accounts
        for account in self.created_accounts[:]:  # Copy list to avoid modification during iteration
            try:
                requests.delete(
                    f"{BACKEND_URL}/admin/accounts/{account['id']}",
                    headers=headers
                )
                self.created_accounts.remove(account)
            except:
                pass  # Ignore errors during cleanup

        # Now try to redeem a key when no accounts exist
        if self.created_keys:
            valid_key = self.created_keys[0]["key_value"]
            
            try:
                response = requests.post(
                    f"{BACKEND_URL}/redeem-key",
                    json={"key": valid_key},
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if not data.get("success") and "teslim edilecek hesap bulunmuyor" in data.get("message", ""):
                        self.log_test(
                            "Key Redemption No Accounts",
                            True,
                            "Correctly handled case when no accounts available",
                            {"message": data.get("message")}
                        )
                    else:
                        self.log_test(
                            "Key Redemption No Accounts",
                            False,
                            "Should have failed with 'no accounts available' message",
                            {"response": data}
                        )
                else:
                    self.log_test(
                        "Key Redemption No Accounts",
                        False,
                        f"HTTP {response.status_code}: {response.text}",
                        {"status_code": response.status_code}
                    )
            except Exception as e:
                self.log_test(
                    "Key Redemption No Accounts",
                    False,
                    f"Request failed: {str(e)}",
                    {"error": str(e)}
                )

    def cleanup(self):
        """Clean up test data"""
        if not self.admin_token:
            return

        headers = {
            "Authorization": f"Bearer {self.admin_token}",
            "Content-Type": "application/json"
        }

        # Clean up remaining accounts
        for account in self.created_accounts:
            try:
                requests.delete(
                    f"{BACKEND_URL}/admin/accounts/{account['id']}",
                    headers=headers
                )
            except:
                pass

        # Clean up remaining keys
        for key in self.created_keys:
            try:
                requests.delete(
                    f"{BACKEND_URL}/admin/keys/{key['id']}",
                    headers=headers
                )
            except:
                pass

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 80)
        print("STEAM ACCOUNT DELIVERY SYSTEM - BACKEND API TESTS")
        print("=" * 80)
        print(f"Testing backend at: {BACKEND_URL}")
        print()

        # Test admin authentication
        self.test_admin_authentication_success()
        self.test_admin_authentication_failure()

        # Test CRUD operations (requires authentication)
        self.test_steam_account_crud()
        self.test_delivery_key_crud()

        # Test key redemption scenarios
        self.test_key_redemption_valid()
        self.test_key_redemption_invalid()
        self.test_key_redemption_no_accounts()

        # Cleanup
        self.cleanup()

        # Summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()

        # List failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("FAILED TESTS:")
            for test in failed_tests:
                print(f"❌ {test['test']}: {test['message']}")
        else:
            print("🎉 ALL TESTS PASSED!")

        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)