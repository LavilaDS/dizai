CREATE TYPE campaign_status_enum AS ENUM('PENDENTE', 'ATIVA','CONCLUIDA');
CREATE TYPE participant_status_enum AS ENUM('INVALIDO', 'PENDENTE','ENVIADO','RESPONDIDO');
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

-- Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    manager_id UUID REFERENCES managers(id) ON DELETE CASCADE,
    UNIQUE (name, manager_id)  -- Evita duplicação do mesmo nome para o mesmo gestor
);

-- Questionario_tags
CREATE TABLE questionnaire_tags (
    questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (questionnaire_id, tag_id)
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
    question_type INTEGER REFERENCES question_types(id) NOT NULL,
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

-- Campanhas
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,                             
  quantity INTEGER NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status campaign_status_enum NOT NULL DEFAULT 'PENDENTE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,                       
  ended_at TIMESTAMPTZ,                        
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Participantes
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    token UUID NOT NULL,
    email_resend_attempts INT DEFAULT 0,
    status participant_status_enum NOT NULL DEFAULT 'PENDENTE',
    sent_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    UNIQUE(campaign_id, email)
);