from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

def stress_test_layout():
    chrome_options = Options()
    # chrome_options.add_argument("--headless") 
    driver = webdriver.Chrome(options=chrome_options)
    
    # Test different devices (Mobile vs Desktop)
    viewports = [(375, 812), (1440, 900)] # iPhone X and Desktop
    
    try:
        for width, height in viewports:
            print(f"\n--- Testing Viewport: {width}x{height} ---")
            driver.set_window_size(width, height)
            driver.get("https://luminaqr.nithinms.cv/")
            
            time.sleep(3) # Allow ads to render
            
            # Check for ad overlap using JavaScript
            overlap = driver.execute_script("""
                const ad = document.getElementById('container-9b4e84791703585706cbeb6c94a84d84');
                if (!ad) return "Missing";
                const rect = ad.getBoundingClientRect();
                // Simple check if it has non-zero dimensions
                if (rect.width === 0 || rect.height === 0) return "Hidden/Empty";
                
                return "Present (Dimensions: " + rect.width + "x" + rect.height + ")";
            """)
            print(f"Native Ad Status: {overlap}")
            
            # Also quickly check for the 728x90 banner if it exists
            # Since we moved it, let's see if we can find it by generic class or structure if IDs aren't set
            # But the native one is the most complex usually.

    finally:
        driver.quit()

if __name__ == "__main__":
    stress_test_layout()
