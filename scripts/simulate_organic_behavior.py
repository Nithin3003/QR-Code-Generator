
import time
import random
import argparse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

# Note: You must install this package: pip install undetected-chromedriver
try:
    import undetected_chromedriver as uc
    USING_UC = True
except ImportError:
    print("undetected-chromedriver not found. Falling back to standard Selenium.")
    print("To install: pip install undetected-chromedriver")
    USING_UC = False

def natural_behavior(url):
    print(f"🚀 Starting simulation on: {url}")
    
    if USING_UC:
        options = uc.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        driver = uc.Chrome(options=options)
    else:
        # Fallback to standard driver for testing without UC
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)
        # Random initial wait for page load and "reading"
        sleep_time = random.uniform(3, 6)
        print(f"⏱️  Waiting {sleep_time:.2f}s for page load...")
        time.sleep(sleep_time)

        # 1. Simulate Reading (Random Scrolling)
        scroll_passes = random.randint(3, 7)
        print(f"📜 Simulating {scroll_passes} scroll interactions...")
        
        for i in range(scroll_passes):
            scroll_amount = random.randint(200, 600)
            driver.execute_script(f"window.scrollBy(0, {scroll_amount});")
            print(f"   - Scrolled down {scroll_amount}px")
            time.sleep(random.uniform(1.5, 4.0)) # Pause to "read"

        # 2. Simulate Random Mouse Hovering
        # Find paragraphs or visible text blocks to hover over
        elements = driver.find_elements(By.TAG_NAME, 'p') 
        if elements:
            # Pick a random visible element
            visible_elements = [el for el in elements if el.is_displayed()]
            if visible_elements:
                target = random.choice(visible_elements)
                try:
                    actions = ActionChains(driver)
                    actions.move_to_element(target)
                    actions.perform()
                    print("🖱️  Moved mouse to content paragraph")
                    time.sleep(random.uniform(1, 2))
                except Exception as e:
                    print(f"   (Hover failed: {e})")

        # 3. Randomly click a safe internal link (like a menu or related post)
        links = driver.find_elements(By.TAG_NAME, 'a')
        if links:
            # Filter for internal links to stay on the site
            # and ignore empty links or javascript: calls
            internal_links = [
                l for l in links 
                if l.get_attribute('href') 
                and url in l.get_attribute('href')
                and l.is_displayed()
            ]
            
            if internal_links:
                random_link = random.choice(internal_links)
                link_text = random_link.text[:30] if random_link.text else "Image/Icon Link"
                print(f"🔗 Simulating click on: '{link_text}'")
                
                # Scroll to link before clicking (more natural)
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", random_link)
                time.sleep(random.uniform(1, 2))
                
                try:
                    random_link.click()
                    print("   - Click successful. Reading new page...")
                    time.sleep(random.uniform(5, 10))
                except Exception as e:
                    print(f"   (Click intercepted or failed: {e})")
            else:
                print("⚠️ No valid internal links found to click.")

    except Exception as e:
        print(f"❌ Error during simulation: {e}")
    finally:
        print("🛑 Closing driver.")
        driver.quit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Simulate natural user behavior on a website.')
    parser.add_argument('--url', type=str, default="https://luminaqr.vercel.app", help='Target URL')
    args = parser.parse_args()
    
    natural_behavior(args.url)
