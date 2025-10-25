'''
Business: Manage job postings - create, read, update, search with advanced filters
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with job data or status
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if method == 'GET':
            return get_jobs(event)
        elif method == 'POST':
            return create_job(event)
        elif method == 'PUT':
            return update_job(event)
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

def get_jobs(event: Dict[str, Any]) -> Dict[str, Any]:
    params = event.get('queryStringParameters') or {}
    job_id = params.get('id')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if job_id:
        cursor.execute('''
            SELECT j.*, 
                   c.name as category_name,
                   i.name as industry_name,
                   co.name as company_name,
                   ci.name as city_name,
                   ct.name as country_name,
                   u.first_name || ' ' || u.last_name as employer_name,
                   COALESCE(json_agg(
                       json_build_object('id', s.id, 'name', s.name, 'required', js.required)
                   ) FILTER (WHERE s.id IS NOT NULL), '[]') as skills
            FROM jobs j
            LEFT JOIN categories c ON j.category_id = c.id
            LEFT JOIN industries i ON j.industry_id = i.id
            LEFT JOIN companies co ON j.company_id = co.id
            LEFT JOIN cities ci ON j.city_id = ci.id
            LEFT JOIN countries ct ON j.country_id = ct.id
            LEFT JOIN users u ON j.employer_id = u.id
            LEFT JOIN job_skills js ON j.id = js.job_id
            LEFT JOIN skills s ON js.skill_id = s.id
            WHERE j.id = %s
            GROUP BY j.id, c.name, i.name, co.name, ci.name, ct.name, u.first_name, u.last_name
        ''', (job_id,))
        job = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not job:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Job not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(dict(job), default=str),
            'isBase64Encoded': False
        }
    
    category_id = params.get('category_id')
    industry_id = params.get('industry_id')
    city_id = params.get('city_id')
    employment_type = params.get('employment_type')
    experience = params.get('experience')
    search = params.get('search', '')
    remote_only = params.get('remote_only') == 'true'
    employer_id = params.get('employer_id')
    skills_filter = params.get('skills')
    
    query = '''
        SELECT DISTINCT j.*, 
               c.name as category_name,
               i.name as industry_name,
               co.name as company_name,
               ci.name as city_name,
               ct.name as country_name,
               u.first_name || ' ' || u.last_name as employer_name
        FROM jobs j
        LEFT JOIN categories c ON j.category_id = c.id
        LEFT JOIN industries i ON j.industry_id = i.id
        LEFT JOIN companies co ON j.company_id = co.id
        LEFT JOIN cities ci ON j.city_id = ci.id
        LEFT JOIN countries ct ON j.country_id = ct.id
        LEFT JOIN users u ON j.employer_id = u.id
        LEFT JOIN job_skills js ON j.id = js.job_id
        LEFT JOIN skills s ON js.skill_id = s.id
        WHERE j.status = 'active'
    '''
    
    conditions = []
    if search:
        conditions.append(f"(j.title ILIKE '%{search}%' OR j.description ILIKE '%{search}%')")
    if category_id:
        conditions.append(f"j.category_id = {category_id}")
    if industry_id:
        conditions.append(f"j.industry_id = {industry_id}")
    if city_id:
        conditions.append(f"j.city_id = {city_id}")
    if employment_type:
        conditions.append(f"j.employment_type = '{employment_type}'")
    if experience:
        conditions.append(f"j.experience_required = '{experience}'")
    if remote_only:
        conditions.append("j.remote_allowed = true")
    if employer_id:
        conditions.append(f"j.employer_id = {employer_id}")
    if skills_filter:
        skill_ids = skills_filter.split(',')
        conditions.append(f"s.id IN ({','.join(skill_ids)})")
    
    if conditions:
        query += ' AND ' + ' AND '.join(conditions)
    
    query += ' ORDER BY j.created_at DESC LIMIT 100'
    
    cursor.execute(query)
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps([dict(job) for job in jobs], default=str),
        'isBase64Encoded': False
    }

def create_job(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    required_fields = ['title', 'description', 'employer_id']
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
    
    cursor.execute('''
        INSERT INTO jobs (
            title, description, requirements, responsibilities,
            salary_min, salary_max, salary_currency, employment_type,
            experience_required, category_id, industry_id, company_id,
            employer_id, city_id, country_id, remote_allowed, deadline
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *
    ''', (
        body_data['title'],
        body_data['description'],
        body_data.get('requirements'),
        body_data.get('responsibilities'),
        body_data.get('salary_min'),
        body_data.get('salary_max'),
        body_data.get('salary_currency', 'RUB'),
        body_data.get('employment_type'),
        body_data.get('experience_required'),
        body_data.get('category_id'),
        body_data.get('industry_id'),
        body_data.get('company_id'),
        body_data['employer_id'],
        body_data.get('city_id'),
        body_data.get('country_id'),
        body_data.get('remote_allowed', False),
        body_data.get('deadline')
    ))
    
    job = cursor.fetchone()
    job_id = job['id']
    
    if 'skills' in body_data and body_data['skills']:
        for skill_id in body_data['skills']:
            cursor.execute('''
                INSERT INTO job_skills (job_id, skill_id, required)
                VALUES (%s, %s, %s)
            ''', (job_id, skill_id, True))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(dict(job), default=str),
        'isBase64Encoded': False
    }

def update_job(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    job_id = body_data.get('id')
    
    if not job_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing job id'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    update_fields = []
    values = []
    
    if 'status' in body_data:
        update_fields.append('status = %s')
        values.append(body_data['status'])
    if 'title' in body_data:
        update_fields.append('title = %s')
        values.append(body_data['title'])
    if 'description' in body_data:
        update_fields.append('description = %s')
        values.append(body_data['description'])
    if 'views_count' in body_data:
        update_fields.append('views_count = views_count + 1')
    
    if not update_fields:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No fields to update'}),
            'isBase64Encoded': False
        }
    
    values.append(job_id)
    query = f"UPDATE jobs SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
    
    cursor.execute(query, values)
    job = cursor.fetchone()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(dict(job) if job else {}, default=str),
        'isBase64Encoded': False
    }
