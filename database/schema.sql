-- Gestores
CREATE TABLE managers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Empresas
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    manager_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questionários
CREATE TABLE questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES managers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questionario_tags
CREATE TABLE questionnaire_tags (
    questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (questionnaire_id, tag_id)
);

-- Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    manager_id UUID REFERENCES managers(id) ON DELETE CASCADE,
    UNIQUE (name, manager_id)  -- Evita duplicação do mesmo nome para o mesmo gestor
);

-- Tipos de Perguntas
CREATE TABLE question_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Perguntas
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    response_time INT NOT NULL,
    question_type INTEGER REFERENCES question_types(id) NOT NULL ON DELETE RESTRICT,
    order_number INTEGER,
    required BOOLEAN DEFAULT TRUE
);

-- Opções de resposta
CREATE TABLE answer_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    order_number INTEGER NOT NULL
);