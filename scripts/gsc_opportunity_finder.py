
import argparse
import sys
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import pandas as pd

# SCOPES for Google Search Console
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

def get_service():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Check if credentials.json exists
            if not os.path.exists('credentials.json'):
                print("❌ Error: 'credentials.json' not found.")
                print("1. Go to Google Cloud Console.")
                print("2. Enable 'Google Search Console API'.")
                print("3. Download OAuth 2.0 Client credentials as 'credentials.json'.")
                sys.exit(1)
                
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('searchconsole', 'v1', credentials=creds)

def find_striking_distance_keywords(service, site_url, days=30):
    print(f"🔍 Analyzing {site_url} for the last {days} days...")
    
    request = {
        'startDate': (pd.Timestamp.now() - pd.Timedelta(days=days)).strftime('%Y-%m-%d'),
        'endDate': pd.Timestamp.now().strftime('%Y-%m-%d'),
        'dimensions': ['query', 'page'],
        'rowLimit': 5000
    }
    
    response = service.searchanalytics().query(siteUrl=site_url, body=request).execute()
    rows = response.get('rows', [])
    
    if not rows:
        print("No data found.")
        return

    data = []
    for row in rows:
        query = row['keys'][0]
        page = row['keys'][1]
        position = row['position']
        clicks = row['clicks']
        impressions = row['impressions']
        ctr = row['ctr']
        
        # Filter for "Striking Distance" (Pos 11-20)
        if 10.0 < position <= 25.0:
            data.append({
                'Keyword': query,
                'Page': page,
                'Position': round(position, 1),
                'Impressions': impressions,
                'Clicks': clicks,
                'CTR': f"{ctr:.2%}",
                'Potential': impressions * 0.2 # Est. clicks if moved to Pos 1
            })
            
    df = pd.DataFrame(data)
    
    if not df.empty:
        df = df.sort_values(by='Impressions', ascending=False)
        output_file = 'seo_opportunities.csv'
        df.to_csv(output_file, index=False)
        print(f"\n✅ Found {len(df)} opportunities! Saved to {output_file}")
        print("\nTOP 5 Keyword Opportunities:")
        print(df[['Keyword', 'Position', 'Impressions']].head(5).to_string(index=False))
    else:
        print("No keywords found in positions 11-25. Keep creating content!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Find striking distance SEO keywords.')
    parser.add_argument('--url', type=str, required=True, help='Your GSC Site URL (e.g., https://luminaqr.com)')
    args = parser.parse_args()
    
    service = get_service()
    find_striking_distance_keywords(service, args.url)
