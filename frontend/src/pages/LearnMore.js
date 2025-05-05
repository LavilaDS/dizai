// SaibaMais component with enhanced features and animations
class LearnMore {
  constructor() {
    this.element = document.querySelector('main');
    this.animateElements = this.animateElements.bind(this);
  }

  async render() {
    this.element.innerHTML = `
      <!-- Hero Section -->
      <section class="saiba-mais-hero">
        <div class="container">
          <div class="saiba-mais-hero-content">
            <h1>Descubra o poder do <span class="highlight">DizAí</span></h1>
            <p>Uma plataforma completa de feedback que transforma dados em decisões estratégicas para impulsionar seu negócio.</p>
            <a href="/signup" class="btn btn-primary">Experimente Gratuitamente</a>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="saiba-mais-about">
        <div class="container">
          <div class="section-header">
            <h2>Sobre o <span class="highlight">DizAí</span></h2>
            <p>Conheça nossa plataforma e como ela pode transformar a cultura de feedback da sua empresa</p>
          </div>
          <div class="saiba-mais-about-content">
            <div class="saiba-mais-about-visual">
              <div class="visual-container">
                <div class="platform-illustration">
                  <div class="illustration-card card-primary">
                    <i class="fas fa-chart-line"></i>
                    <span>Insights</span>
                  </div>
                  <div class="illustration-card card-secondary">
                    <i class="fas fa-comments"></i>
                    <span>Feedback</span>
                  </div>
                  <div class="illustration-card card-accent">
                    <i class="fas fa-lightbulb"></i>
                    <span>Ideias</span>
                  </div>
                  <div class="central-circle">
                    <span>DizAí</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="saiba-mais-about-text">
              <p>O DizAí é uma plataforma inovadora para a aplicação e gestão de questionários corporativos. Criado para facilitar a coleta de informações e transformar respostas em insights estratégicos, nosso sistema permite que gestores escolham entre questionários estruturados, personalizem suas aplicações e acompanhem os resultados em tempo real.</p>
              <p>Com um processo intuitivo, o gestor pode selecionar o pacote de aplicação, realizar o pagamento e carregar a lista de funcionários. O DizAí se encarrega de distribuir os formulários, enviar lembretes automáticos e apresentar os dados em gráficos dinâmicos para uma análise detalhada.</p>
              <ul class="saiba-mais-features-list">
                <li><i class="fas fa-check"></i> Questionários estruturados e personalizáveis</li>
                <li><i class="fas fa-check"></i> Distribuição automática de formulários</li>
                <li><i class="fas fa-check"></i> Lembretes automáticos para participantes</li>
                <li><i class="fas fa-check"></i> Análise em tempo real dos resultados</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="saiba-mais-features">
        <div class="container">
          <div class="section-header">
            <h2>Recursos <span class="highlight">Exclusivos</span></h2>
            <p>Conheça as funcionalidades que tornam o DizAí a escolha ideal para sua empresa</p>
          </div>
          <div class="saiba-mais-features-grid">
            <div class="saiba-mais-feature-card">
              <div class="feature-icon">
                <i class="fas fa-poll"></i>
              </div>
              <h3>Questionários Estruturados</h3>
              <p>Escolha entre diversos modelos de questionários prontos para diferentes objetivos organizacionais.</p>
            </div>
            <div class="saiba-mais-feature-card">
              <div class="feature-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <h3>Análise em Tempo Real</h3>
              <p>Acompanhe as respostas assim que são submetidas e visualize dados consolidados instantaneamente.</p>
            </div>
            <div class="saiba-mais-feature-card">
              <div class="feature-icon">
                <i class="fas fa-users"></i>
              </div>
              <h3>Gestão de Participantes</h3>
              <p>Faça upload da lista de funcionários via CSV e gerencie facilmente os participantes da pesquisa.</p>
            </div>
            <div class="saiba-mais-feature-card">
              <div class="feature-icon">
                <i class="fas fa-bell"></i>
              </div>
              <h3>Lembretes Automáticos</h3>
              <p>Sistema inteligente de lembretes para maximizar a taxa de participação nas pesquisas.</p>
            </div>
            <div class="saiba-mais-feature-card">
              <div class="feature-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <h3>Dashboards Interativos</h3>
              <p>Visualize os resultados em gráficos dinâmicos para uma análise mais efetiva dos dados.</p>
            </div>
            <div class="saiba-mais-feature-card">
              <div class="feature-icon">
                <i class="fas fa-file-export"></i>
              </div>
              <h3>Relatórios Detalhados</h3>
              <p>Obtenha insights valiosos através de relatórios completos e classificações automáticas.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="saiba-mais-stats">
        <div class="container">
          <div class="saiba-mais-stats-grid">
            <div class="saiba-mais-stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">Segurança de Dados</div>
            </div>
            <div class="saiba-mais-stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Monitoramento</div>
            </div>
            <div class="saiba-mais-stat-item">
              <div class="stat-number">5min</div>
              <div class="stat-label">Setup Rápido</div>
            </div>
            <div class="saiba-mais-stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">Customizável</div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="saiba-mais-faq">
        <div class="container">
          <div class="section-header">
            <h2>Perguntas <span class="highlight">Frequentes</span></h2>
            <p>Encontre respostas para as dúvidas mais comuns sobre nossa plataforma</p>
          </div>
          <div class="faq-container">
            <div class="faq-item">
              <div class="faq-question">
                <h3>Como funciona o processo de aplicação dos questionários?</h3>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="faq-answer">
                <p>O processo é simples: você seleciona um questionário, define a quantidade de participantes, faz o upload da lista de funcionários via CSV e autoriza o início da campanha. O sistema se encarrega de enviar os convites e lembretes automaticamente.</p>
              </div>
            </div>
            <div class="faq-item">
              <div class="faq-question">
                <h3>Como é feito o envio dos questionários aos funcionários?</h3>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="faq-answer">
                <p>Cada funcionário recebe um link único por e-mail para responder ao questionário. O sistema envia lembretes automáticos para maximizar a participação.</p>
              </div>
            </div>
            <div class="faq-item">
              <div class="faq-question">
                <h3>Como posso acompanhar o status das respostas?</h3>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="faq-answer">
                <p>Através do dashboard em tempo real, você pode acompanhar quantos funcionários já responderam e visualizar os resultados agregados assim que são submetidos.</p>
              </div>
            </div>
            <div class="faq-item">
              <div class="faq-question">
                <h3>Quais tipos de questionários estão disponíveis?</h3>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="faq-answer">
                <p>Oferecemos questionários estruturados para diferentes objetivos, como avaliação de clima organizacional, satisfação dos colaboradores e feedback sobre processos internos.</p>
              </div>
            </div>
            <div class="faq-item">
              <div class="faq-question">
                <h3>Como são apresentados os resultados?</h3>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="faq-answer">
                <p>Os resultados são apresentados em gráficos dinâmicos e relatórios detalhados, permitindo uma análise aprofundada dos dados coletados. O sistema também fornece uma classificação automática do cenário da empresa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="saiba-mais-cta">
        <div class="container">
          <div class="saiba-mais-cta-content">
            <h2>Pronto para transformar feedback em ação?</h2>
            <p>Configure sua primeira pesquisa em menos de 5 minutos</p>
            <a href="/signup" class="btn btn-primary">Comece Agora</a>
            <p class="saiba-mais-cta-note">Processo simplificado e intuitivo</p>
          </div>
        </div>
      </section>
    `;

    this.addEventListeners();
    this.initializeAnimations();
  }

  addEventListeners() {
    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  }

  animateElements() {
    const elements = document.querySelectorAll('.saiba-mais-feature-card, .saiba-mais-stat-item, .section-header:not(.hero .section-header), .saiba-mais-about-content, .faq-item, .platform-illustration, .illustration-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 50) {
        element.classList.add('animate');
      }
    });
  }

  initializeAnimations() {
    // Run once on load
    setTimeout(() => {
      this.animateElements();
    }, 100);
    
    // Run on scroll
    window.addEventListener('scroll', this.animateElements);
  }

  unmount() {
    // Clean up event listeners
    window.removeEventListener('scroll', this.animateElements);
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.removeEventListener('click', () => {});
    });
  }
}

export default LearnMore;