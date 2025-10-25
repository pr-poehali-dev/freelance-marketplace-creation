-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('jobseeker', 'employer', 'admin')),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы заданий
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    budget VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'completed', 'cancelled')),
    location VARCHAR(255),
    deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы откликов
CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    jobseeker_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    proposed_budget VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, jobseeker_id)
);

-- Создание таблицы навыков
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_tasks_employer ON tasks(employer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_responses_task ON responses(task_id);
CREATE INDEX IF NOT EXISTS idx_responses_jobseeker ON responses(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_skills_user ON skills(user_id);

-- Вставка начальных категорий
INSERT INTO categories (name, icon, color) VALUES
('Разработка сайтов', 'Code2', 'bg-blue-50 text-blue-600'),
('Мобильные приложения', 'Smartphone', 'bg-purple-50 text-purple-600'),
('Дизайн и графика', 'Palette', 'bg-pink-50 text-pink-600'),
('Тексты и переводы', 'FileText', 'bg-orange-50 text-orange-600'),
('SEO и маркетинг', 'TrendingUp', 'bg-green-50 text-green-600'),
('Видео и анимация', 'Video', 'bg-red-50 text-red-600'),
('Бизнес-услуги', 'Briefcase', 'bg-indigo-50 text-indigo-600'),
('Обучение', 'GraduationCap', 'bg-yellow-50 text-yellow-600')
ON CONFLICT DO NOTHING;

-- Вставка тестовых пользователей (пароль: password123)
INSERT INTO users (email, name, role, password_hash, description) VALUES
('employer@test.com', 'Компания TechCorp', 'employer', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Разработка IT-решений'),
('jobseeker@test.com', 'Иван Петров', 'jobseeker', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Frontend разработчик с опытом 5 лет'),
('admin@test.com', 'Администратор', 'admin', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Системный администратор')
ON CONFLICT DO NOTHING;

-- Вставка тестовых заданий
INSERT INTO tasks (employer_id, title, description, budget, category_id, status) VALUES
(1, 'Нужен лендинг для стартапа', 'Создать современный лендинг для SaaS продукта. Дизайн готов в Figma.', '25 000 ₽', 1, 'active'),
(1, 'Логотип и фирменный стиль', 'Разработка логотипа и брендбука для кофейни.', '15 000 ₽', 3, 'active'),
(1, 'SEO продвижение интернет-магазина', 'Комплексное SEO продвижение магазина одежды.', 'от 30 000 ₽/мес', 5, 'active'),
(1, 'Написать статьи для блога', 'Нужно 10 статей по IT-тематике, каждая 3000 знаков.', '500 ₽/статья', 4, 'active')
ON CONFLICT DO NOTHING;

-- Вставка навыков для тестового исполнителя
INSERT INTO skills (user_id, skill_name) VALUES
(2, 'React'),
(2, 'TypeScript'),
(2, 'Node.js'),
(2, 'PostgreSQL'),
(2, 'Docker'),
(2, 'AWS')
ON CONFLICT DO NOTHING;