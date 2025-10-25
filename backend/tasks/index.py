import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления заданиями (CRUD операции)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с attributes: request_id, function_name
    Returns: HTTP response dict
    '''
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
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            category_id = params.get('category_id')
            status = params.get('status', 'active')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if category_id:
                    cur.execute(
                        "SELECT t.*, c.name as category_name, u.name as employer_name, "
                        "(SELECT COUNT(*) FROM responses WHERE task_id = t.id) as responses_count "
                        "FROM tasks t "
                        "LEFT JOIN categories c ON t.category_id = c.id "
                        "LEFT JOIN users u ON t.employer_id = u.id "
                        "WHERE t.category_id = %s AND t.status = %s "
                        "ORDER BY t.created_at DESC",
                        (category_id, status)
                    )
                else:
                    cur.execute(
                        "SELECT t.*, c.name as category_name, u.name as employer_name, "
                        "(SELECT COUNT(*) FROM responses WHERE task_id = t.id) as responses_count "
                        "FROM tasks t "
                        "LEFT JOIN categories c ON t.category_id = c.id "
                        "LEFT JOIN users u ON t.employer_id = u.id "
                        "WHERE t.status = %s "
                        "ORDER BY t.created_at DESC LIMIT 20",
                        (status,)
                    )
                
                tasks = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(task) for task in tasks], default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO tasks (employer_id, title, description, budget, category_id, location) "
                    "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                    (
                        body_data.get('employer_id'),
                        body_data.get('title'),
                        body_data.get('description'),
                        body_data.get('budget'),
                        body_data.get('category_id'),
                        body_data.get('location')
                    )
                )
                task_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': task_id, 'message': 'Task created successfully'})
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            task_id = body_data.get('id')
            
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE tasks SET title = %s, description = %s, budget = %s, "
                    "status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (
                        body_data.get('title'),
                        body_data.get('description'),
                        body_data.get('budget'),
                        body_data.get('status'),
                        task_id
                    )
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Task updated successfully'})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
