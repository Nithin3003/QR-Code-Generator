// PropellerAds Service Worker - Multiple Zones
// Zone 1: 5gvci.com - 10364434
// Zone 2: 3nbf4.com - 10364466

// Primary configuration
self.options = {
    "domain": "5gvci.com",
    "zoneId": 10364434
}

// Secondary configuration
self.options2 = {
    "domain": "3nbf4.com",
    "zoneId": 10364466
}

self.lary = ""

// Load both PropellerAds service worker scripts
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')
