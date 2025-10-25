import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления откликами на задания
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            task_id = params.get('task_id')
            jobseeker_id = params.get('jobseeker_id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if task_id:
                    cur.execute(
                        "SELECT r.*, u.name as jobseeker_name, u.description as jobseeker_description "
                        "FROM responses r "
                        "JOIN users u ON r.jobseeker_id = u.id "
                        "WHERE r.task_id = %s "
                        "ORDER BY r.created_at DESC",
                        (task_id,)
                    )
                elif jobseeker_id:
                    cur.execute(
                        "SELECT r.*, t.title as task_title, t.budget as task_budget "
                        "FROM responses r "
                        "JOIN tasks t ON r.task_id = t.id "
                        "WHERE r.jobseeker_id = %s "
                        "ORDER BY r.created_at DESC",
                        (jobseeker_id,)
                    )
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'task_id or jobseeker_id required'})
                    }
                
                responses_list = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(r) for r in responses_list], default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO responses (task_id, jobseeker_id, message, proposed_budget) "
                    "VALUES (%s, %s, %s, %s) RETURNING id",
                    (
                        body_data.get('task_id'),
                        body_data.get('jobseeker_id'),
                        body_data.get('message'),
                        body_data.get('proposed_budget')
                    )
                )
                response_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': response_id, 'message': 'Response created successfully'})
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            response_id = body_data.get('id')
            
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE responses SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (body_data.get('status'), response_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Response updated successfully'})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
