'''
Business: Manage job applications - apply, view, update status, download resume
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with application data
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
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if method == 'GET':
            return get_applications(event)
        elif method == 'POST':
            return create_application(event)
        elif method == 'PUT':
            return update_application(event)
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

def get_applications(event: Dict[str, Any]) -> Dict[str, Any]:
    params = event.get('queryStringParameters') or {}
    job_id = params.get('job_id')
    jobseeker_id = params.get('jobseeker_id')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = '''
        SELECT ja.*, 
               j.title as job_title,
               j.company_id,
               co.name as company_name,
               u.first_name || ' ' || u.last_name as jobseeker_name,
               u.email as jobseeker_email,
               u.phone as jobseeker_phone,
               u.resume_url as jobseeker_resume,
               u.bio as jobseeker_bio,
               u.experience_years as jobseeker_experience
        FROM job_applications ja
        JOIN jobs j ON ja.job_id = j.id
        JOIN users u ON ja.jobseeker_id = u.id
        LEFT JOIN companies co ON j.company_id = co.id
        WHERE 1=1
    '''
    
    conditions = []
    if job_id:
        conditions.append(f"ja.job_id = {job_id}")
    if jobseeker_id:
        conditions.append(f"ja.jobseeker_id = {jobseeker_id}")
    
    if conditions:
        query += ' AND ' + ' AND '.join(conditions)
    
    query += ' ORDER BY ja.applied_at DESC'
    
    cursor.execute(query)
    applications = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps([dict(app) for app in applications], default=str),
        'isBase64Encoded': False
    }

def create_application(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    required_fields = ['job_id', 'jobseeker_id']
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
        SELECT id FROM job_applications 
        WHERE job_id = %s AND jobseeker_id = %s
    ''', (body_data['job_id'], body_data['jobseeker_id']))
    
    existing = cursor.fetchone()
    if existing:
        cursor.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Already applied to this job'}),
            'isBase64Encoded': False
        }
    
    cursor.execute('''
        INSERT INTO job_applications (
            job_id, jobseeker_id, cover_letter, resume_url
        ) VALUES (%s, %s, %s, %s)
        RETURNING *
    ''', (
        body_data['job_id'],
        body_data['jobseeker_id'],
        body_data.get('cover_letter'),
        body_data.get('resume_url')
    ))
    
    application = cursor.fetchone()
    
    cursor.execute('''
        UPDATE jobs 
        SET applications_count = applications_count + 1 
        WHERE id = %s
    ''', (body_data['job_id'],))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(dict(application), default=str),
        'isBase64Encoded': False
    }

def update_application(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    application_id = body_data.get('id')
    
    if not application_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing application id'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    update_fields = []
    values = []
    
    if 'status' in body_data:
        update_fields.append('status = %s')
        values.append(body_data['status'])
    
    if not update_fields:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No fields to update'}),
            'isBase64Encoded': False
        }
    
    values.append(application_id)
    query = f"UPDATE job_applications SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
    
    cursor.execute(query, values)
    application = cursor.fetchone()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(dict(application) if application else {}, default=str),
        'isBase64Encoded': False
    }
