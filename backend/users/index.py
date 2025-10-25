'''
Business: User management - registration, profile updates, skill management, resume search
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with user data
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
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Allow-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if method == 'GET':
            return get_users(event)
        elif method == 'POST':
            return create_user(event)
        elif method == 'PUT':
            return update_user(event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def get_users(event: Dict[str, Any]) -> Dict[str, Any]:
    params = event.get('queryStringParameters') or {}
    user_id = params.get('id')
    email = params.get('email')
    role = params.get('role')
    search = params.get('search', '')
    skills_filter = params.get('skills')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if user_id:
        cursor.execute('''
            SELECT u.*,
                   ci.name as city_name,
                   ct.name as country_name,
                   el.name as education_level_name,
                   c.name as company_name,
                   COALESCE(json_agg(
                       json_build_object(
                           'id', s.id, 
                           'name', s.name, 
                           'proficiency', us.proficiency_level
                       )
                   ) FILTER (WHERE s.id IS NOT NULL), '[]') as skills
            FROM users u
            LEFT JOIN cities ci ON u.city_id = ci.id
            LEFT JOIN countries ct ON u.country_id = ct.id
            LEFT JOIN education_levels el ON u.education_level_id = el.id
            LEFT JOIN companies c ON u.company_id = c.id
            LEFT JOIN user_skills us ON u.id = us.user_id
            LEFT JOIN skills s ON us.skill_id = s.id
            WHERE u.id = %s
            GROUP BY u.id, ci.name, ct.name, el.name, c.name
        ''', (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        user_dict = dict(user)
        user_dict.pop('password_hash', None)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(user_dict, default=str),
            'isBase64Encoded': False
        }
    
    if email:
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(dict(user), default=str),
            'isBase64Encoded': False
        }
    
    query = '''
        SELECT DISTINCT u.id, u.email, u.role, u.first_name, u.last_name,
               u.phone, u.bio, u.experience_years, u.current_position,
               u.resume_url, u.active, u.created_at,
               ci.name as city_name,
               ct.name as country_name
        FROM users u
        LEFT JOIN cities ci ON u.city_id = ci.id
        LEFT JOIN countries ct ON u.country_id = ct.id
        LEFT JOIN user_skills us ON u.id = us.user_id
        LEFT JOIN skills s ON us.skill_id = s.id
        WHERE u.active = true
    '''
    
    conditions = []
    if role:
        conditions.append(f"u.role = '{role}'")
    if search:
        conditions.append(f"(u.first_name ILIKE '%{search}%' OR u.last_name ILIKE '%{search}%' OR u.email ILIKE '%{search}%' OR u.current_position ILIKE '%{search}%')")
    if skills_filter:
        skill_ids = skills_filter.split(',')
        conditions.append(f"s.id IN ({','.join(skill_ids)})")
    
    if conditions:
        query += ' AND ' + ' AND '.join(conditions)
    
    query += ' ORDER BY u.created_at DESC'
    
    cursor.execute(query)
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    
    users_list = []
    for user in users:
        user_dict = dict(user)
        user_dict.pop('password_hash', None)
        users_list.append(user_dict)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(users_list, default=str),
        'isBase64Encoded': False
    }

def create_user(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    required_fields = ['email', 'password', 'role', 'first_name', 'last_name']
    for field in required_fields:
        if field not in body_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Missing required field: {field}'}),
                'isBase64Encoded': False
            }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('SELECT id FROM users WHERE email = %s', (body_data['email'],))
    existing = cursor.fetchone()
    
    if existing:
        cursor.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email already registered'}),
            'isBase64Encoded': False
        }
    
    password_hash = '$2a$10$' + body_data['password']
    
    cursor.execute('''
        INSERT INTO users (
            email, password_hash, role, first_name, last_name,
            phone, city_id, country_id, bio, education_level_id, current_position
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, email, role, first_name, last_name, created_at
    ''', (
        body_data['email'],
        password_hash,
        body_data['role'],
        body_data['first_name'],
        body_data['last_name'],
        body_data.get('phone'),
        body_data.get('city_id'),
        body_data.get('country_id'),
        body_data.get('bio'),
        body_data.get('education_level_id'),
        body_data.get('current_position')
    ))
    
    user = cursor.fetchone()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(dict(user), default=str),
        'isBase64Encoded': False
    }

def update_user(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    user_id = body_data.get('id')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing user id'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    update_fields = []
    values = []
    
    allowed_fields = [
        'first_name', 'last_name', 'phone', 'bio', 'city_id', 
        'country_id', 'resume_url', 'profile_photo_url', 
        'experience_years', 'education_level_id', 'current_position', 'active'
    ]
    
    for field in allowed_fields:
        if field in body_data:
            update_fields.append(f'{field} = %s')
            values.append(body_data[field])
    
    if 'skills' in body_data:
        cursor.execute('DELETE FROM user_skills WHERE user_id = %s', (user_id,))
        for skill_data in body_data['skills']:
            cursor.execute('''
                INSERT INTO user_skills (user_id, skill_id, proficiency_level)
                VALUES (%s, %s, %s)
            ''', (user_id, skill_data['skill_id'], skill_data.get('proficiency_level', 'intermediate')))
    
    if not update_fields:
        conn.commit()
        cursor.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Skills updated'}),
            'isBase64Encoded': False
        }
    
    values.append(user_id)
    query = f"UPDATE users SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
    
    cursor.execute(query, values)
    user = cursor.fetchone()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    user_dict = dict(user) if user else {}
    user_dict.pop('password_hash', None)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(user_dict, default=str),
        'isBase64Encoded': False
    }
