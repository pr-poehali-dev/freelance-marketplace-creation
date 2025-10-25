'''
Business: Manage reference data - categories, industries, cities, countries, skills, education levels
Args: event with httpMethod, queryStringParameters
Returns: HTTP response with reference data
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters') or {}
        ref_type = params.get('type', 'all')
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        result = {}
        
        if ref_type in ['all', 'categories']:
            cursor.execute('SELECT * FROM categories WHERE active = true ORDER BY name')
            result['categories'] = [dict(row) for row in cursor.fetchall()]
        
        if ref_type in ['all', 'industries']:
            cursor.execute('SELECT * FROM industries WHERE active = true ORDER BY name')
            result['industries'] = [dict(row) for row in cursor.fetchall()]
        
        if ref_type in ['all', 'countries']:
            cursor.execute('SELECT * FROM countries ORDER BY name')
            result['countries'] = [dict(row) for row in cursor.fetchall()]
        
        if ref_type in ['all', 'cities']:
            cursor.execute('''
                SELECT c.*, ct.name as country_name 
                FROM cities c
                JOIN countries ct ON c.country_id = ct.id
                ORDER BY c.name
            ''')
            result['cities'] = [dict(row) for row in cursor.fetchall()]
        
        if ref_type in ['all', 'skills']:
            cursor.execute('SELECT * FROM skills ORDER BY name')
            result['skills'] = [dict(row) for row in cursor.fetchall()]
        
        if ref_type in ['all', 'education_levels']:
            cursor.execute('SELECT * FROM education_levels ORDER BY id')
            result['education_levels'] = [dict(row) for row in cursor.fetchall()]
        
        if ref_type in ['all', 'companies']:
            cursor.execute('''
                SELECT c.*, 
                       i.name as industry_name,
                       ci.name as city_name
                FROM companies c
                LEFT JOIN industries i ON c.industry_id = i.id
                LEFT JOIN cities ci ON c.city_id = ci.id
                ORDER BY c.name
            ''')
            result['companies'] = [dict(row) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
