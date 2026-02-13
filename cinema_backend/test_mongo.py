"""
Test script for MongoDB collections GET and POST operations
"""
import requests
import json
from datetime import date

BASE_URL = "http://127.0.0.1:8000/api"

def get_token():
    """Login and get JWT token"""
    response = requests.post(
        f"{BASE_URL}/auth/login/",
        json={"username": "admin", "password": "admin"}
    )
    if response.status_code == 200:
        return response.json()["access"]
    else:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        return None

def test_movie_catalog():
    """Test Movie Catalog Collection (GET and POST)"""
    print("\n" + "="*60)
    print("Testing Movie Catalog Collection (movie_catalog)")
    print("="*60)
    
    token = get_token()
    if not token:
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # TEST POST - Create a new movie catalog entry
    print("\n📝 Testing POST /api/movie-types/ (Create)")
    movie_data = {
        "movie_title": "Inception",
        "genre": "Sci-Fi",
        "duration_min": 148,
        "rating": "PG-13",
        "is_active": True
    }
    
    response = requests.post(
        f"{BASE_URL}/movie-types/",
        json=movie_data,
        headers=headers
    )
    
    if response.status_code == 201:
        created_movie = response.json()
        print(f"✅ POST Success (201 Created)")
        print(f"   Created Movie ID: {created_movie.get('id')}")
        print(f"   Data: {json.dumps(created_movie, indent=2)}")
        movie_id = created_movie.get('id')
    else:
        print(f"❌ POST Failed: {response.status_code} - {response.text}")
        movie_id = None
    
    # TEST GET - List all movie catalog entries
    print("\n📋 Testing GET /api/movie-types/ (List All)")
    response = requests.get(f"{BASE_URL}/movie-types/", headers=headers)
    
    if response.status_code == 200:
        movies = response.json()
        print(f"✅ GET Success (200 OK)")
        print(f"   Total movies: {len(movies)}")
        for movie in movies[:3]:  # Show first 3
            print(f"   - {movie.get('movie_title')} ({movie.get('genre')}) - {movie.get('duration_min')} min")
    else:
        print(f"❌ GET Failed: {response.status_code} - {response.text}")
    
    # TEST GET by ID - Get specific movie
    if movie_id:
        print(f"\n🔍 Testing GET /api/movie-types/{movie_id}/ (Get by ID)")
        response = requests.get(f"{BASE_URL}/movie-types/{movie_id}/", headers=headers)
        
        if response.status_code == 200:
            movie = response.json()
            print(f"✅ GET by ID Success (200 OK)")
            print(f"   {json.dumps(movie, indent=2)}")
        else:
            print(f"❌ GET by ID Failed: {response.status_code} - {response.text}")

def test_reservation_events():
    """Test Reservation Events Collection (GET and POST)"""
    print("\n" + "="*60)
    print("Testing Reservation Events Collection (reservation_events)")
    print("="*60)
    
    token = get_token()
    if not token:
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # TEST POST - Create a new reservation event
    print("\n📝 Testing POST /api/reservations-services/ (Create)")
    event_data = {
        "reservation_id": 1,
        "event_type": "confirmed",
        "source": "web_app",
        "note": "Reservation confirmed by customer"
    }
    
    response = requests.post(
        f"{BASE_URL}/reservations-services/",
        json=event_data,
        headers=headers
    )
    
    if response.status_code == 201:
        created_event = response.json()
        print(f"✅ POST Success (201 Created)")
        print(f"   Created Event ID: {created_event.get('id')}")
        print(f"   Data: {json.dumps(created_event, indent=2)}")
        event_id = created_event.get('id')
    else:
        print(f"❌ POST Failed: {response.status_code} - {response.text}")
        event_id = None
    
    # TEST GET - List all reservation events
    print("\n📋 Testing GET /api/reservations-services/ (List All)")
    response = requests.get(f"{BASE_URL}/reservations-services/", headers=headers)
    
    if response.status_code == 200:
        events = response.json()
        print(f"✅ GET Success (200 OK)")
        print(f"   Total events: {len(events)}")
        for event in events[:3]:  # Show first 3
            print(f"   - Reservation #{event.get('reservation_id')} - {event.get('event_type')} ({event.get('source')})")
    else:
        print(f"❌ GET Failed: {response.status_code} - {response.text}")
    
    # TEST GET by ID - Get specific event
    if event_id:
        print(f"\n🔍 Testing GET /api/reservations-services/{event_id}/ (Get by ID)")
        response = requests.get(f"{BASE_URL}/reservations-services/{event_id}/", headers=headers)
        
        if response.status_code == 200:
            event = response.json()
            print(f"✅ GET by ID Success (200 OK)")
            print(f"   {json.dumps(event, indent=2)}")
        else:
            print(f"❌ GET by ID Failed: {response.status_code} - {response.text}")

def main():
    print("\n" + "="*60)
    print("MongoDB Collections GET/POST Verification")
    print("="*60)
    print("\nCollections to test:")
    print("1. movie_catalog - Movie titles, genres, durations, ratings")
    print("2. reservation_events - Reservation event tracking")
    print("\nEndpoints:")
    print("- POST /api/movie-types/")
    print("- GET  /api/movie-types/")
    print("- GET  /api/movie-types/<id>/")
    print("- POST /api/reservations-services/")
    print("- GET  /api/reservations-services/")
    print("- GET  /api/reservations-services/<id>/")
    
    try:
        test_movie_catalog()
        test_reservation_events()
        
        print("\n" + "="*60)
        print("✅ All tests completed!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to server at http://127.0.0.1:8000")
        print("Please make sure the Django server is running:")
        print("  cd cinema_backend && python manage.py runserver\n")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")

if __name__ == "__main__":
    main()
