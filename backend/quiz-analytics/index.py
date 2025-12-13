import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Сохраняет результаты прохождения тестов и предоставляет аналитику
    Args: event - dict с httpMethod, body (данные теста)
          context - объект с request_id и др.
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            video_title = body_data.get('videoTitle', '')
            total_questions = body_data.get('totalQuestions', 0)
            correct_answers = body_data.get('correctAnswers', 0)
            completion_time = body_data.get('completionTimeSeconds', 0)
            answers = body_data.get('answers', [])
            
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO quiz_sessions (video_title, total_questions, correct_answers, completion_time_seconds) "
                    "VALUES (%s, %s, %s, %s) RETURNING id",
                    (video_title, total_questions, correct_answers, completion_time)
                )
                session_id = cur.fetchone()[0]
                
                for answer in answers:
                    cur.execute(
                        "INSERT INTO quiz_answers (session_id, question_text, selected_answer_index, "
                        "correct_answer_index, is_correct) VALUES (%s, %s, %s, %s, %s)",
                        (
                            session_id,
                            answer.get('questionText', ''),
                            answer.get('selectedAnswerIndex', -1),
                            answer.get('correctAnswerIndex', -1),
                            answer.get('isCorrect', False)
                        )
                    )
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'sessionId': session_id}),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT 
                        video_title,
                        COUNT(*) as total_sessions,
                        AVG(correct_answers::float / total_questions * 100) as avg_score,
                        AVG(completion_time_seconds) as avg_time
                    FROM quiz_sessions
                    GROUP BY video_title
                    ORDER BY total_sessions DESC
                """)
                video_stats = cur.fetchall()
                
                cur.execute("""
                    SELECT 
                        question_text,
                        COUNT(*) as total_answers,
                        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_count,
                        ROUND(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 1) as success_rate
                    FROM quiz_answers
                    GROUP BY question_text
                    ORDER BY success_rate ASC
                    LIMIT 10
                """)
                difficult_questions = cur.fetchall()
                
                cur.execute("""
                    SELECT COUNT(*) as total_sessions,
                           AVG(correct_answers::float / total_questions * 100) as overall_avg_score
                    FROM quiz_sessions
                """)
                overall_stats = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'videoStats': video_stats,
                    'difficultQuestions': difficult_questions,
                    'overallStats': overall_stats
                }, default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()
