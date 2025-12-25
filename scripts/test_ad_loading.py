from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def verify_ads():
    # Setup Chrome options (headless for CI/CD, or regular to watch)
    chrome_options = Options()
    # chrome_options.add_argument("--headless")  # Uncomment to run in background
    
    print("Starting browser...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        url = "https://luminaqr.nithinms.cv/"
        print(f"Navigating to {url}...")
        driver.get(url)
        
        # Wait for page to verify load
        time.sleep(5)
        
        # Scroll to bottom to trigger any lazy loading or bottom placements
        print("Scrolling page to check layout...")
        total_height = int(driver.execute_script("return document.body.scrollHeight"))
        for i in range(1, total_height, 300):
            driver.execute_script(f"window.scrollTo(0, {i});")
            time.sleep(0.1)
            
        print("\n--- Checking Ad Containers ---")
        
        # 1. Native Banner Container Check (ID from your code)
        try:
            native_container = driver.find_element(By.ID, "container-9b4e84791703585706cbeb6c94a84d84")
            print("[PASS] Native Banner container found.")
            
            # Check if it has height (content loaded)
            if native_container.size['height'] > 0:
                print(f"       Status: Visible (Height: {native_container.size['height']}px)")
            else:
                print("       Status: Present but empty (0px height)")
                
        except Exception:
            print("[FAIL] Native Banner container NOT found.")

        # 2. Check for 'ADVERTISEMENT' labels (Generic check for banners)
        try:
            # We look for the Typography elements containing "ADVERTISEMENT" or "SPONSORED"
            ads = driver.find_elements(By.XPATH, "//*[contains(text(), 'ADVERTISEMENT') or contains(text(), 'SPONSORED')]")
            print(f"[INFO] Found {len(ads)} ad labels on the page.")
            
            for index, ad in enumerate(ads):
                # Verify visibility
                if ad.is_displayed():
                    print(f"       Ad Label #{index+1}: Visible at location {ad.location}")
                else:
                    print(f"       Ad Label #{index+1}: Detected but not visible")
                    
        except Exception as e:
            print(f"[FAIL] Error checking generic banner content: {e}")

    except Exception as e:
        print(f"An error occurred during testing: {e}")
        
    finally:
        print("\nTest complete. Closing browser.")
        driver.quit()

if __name__ == "__main__":
    verify_ads()
