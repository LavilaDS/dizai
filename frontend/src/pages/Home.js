// Home component
class Home {
  constructor() {
    this.element = document.querySelector('main');
  }

  async render() {
    this.element.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Transforme <span class="highlight">feedback</span> em decisões estratégicas</h1>
            <p>Plataforma completa para aplicação e gestão de questionários corporativos que facilitam a coleta de informações e transformam respostas em insights estratégicos para gestores.</p>
            <div class="hero-buttons">
              <a href="/signup" class="btn btn-primary">Comece Agora</a>
              <a href="/about" class="btn btn-secondary">Saiba Mais</a> <!-- Updated button to navigate to SaibaMais -->
            </div>
            <div class="hero-note">
              <p>Configure sua primeira pesquisa em menos de 5 minutos</p>
            </div>
          </div>
          <div class="hero-image">
            <img src="../src/assets/img/hero-image.svg" alt="DizAí Dashboard Preview">
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section id="benefits" class="benefits">
        <div class="container">
          <div class="section-header">
            <h2>Benefícios da plataforma <span class="highlight">DizAí</span></h2>
            <p>Nossas funcionalidades foram desenvolvidas para maximizar seus resultados e simplificar seus processos.</p>
          </div>
          <div class="benefits-cards">
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="../src/assets/img/dashboard-icon.svg" alt="Dashboard Intuitivo">
              </div>
              <h3>Dashboard Intuitivo</h3>
              <p>Visualize todos os dados coletados de forma clara e objetiva, facilitando a interpretação e tomada de decisões.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="../src/assets/img/analysis-icon.svg" alt="Análises Detalhadas">
              </div>
              <h3>Análises Detalhadas</h3>
              <p>Explore os dados em profundidade com relatórios customizáveis e gráficos interativos que revelam padrões importantes.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="../src/assets/img/engagement-icon.svg" alt="Engajamento Simplificado">
              </div>
              <h3>Engajamento Simplificado</h3>
              <p>Aumente a participação com formulários intuitivos e processos otimizados que economizam tempo dos participantes.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works Section -->
      <section id="how-it-works" class="how-it-works">
        <div class="container">
          <div class="section-header">
            <h2>Como o <span class="highlight">DizAí</span> funciona</h2>
            <p>Processo simplificado em quatro etapas para transformar feedback em insights valiosos.</p>
          </div>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Escolha seu questionário</h3>
                <p>Selecione entre modelos prontos ou crie questionários personalizados de acordo com suas necessidades específicas.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Configure sua campanha</h3>
                <p>Defina o público-alvo, cronograma e canais de distribuição para maximizar a taxa de resposta.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Acompanhe em tempo real</h3>
                <p>Monitore as respostas à medida que chegam e visualize estatísticas atualizadas automaticamente.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>Analise os resultados</h3>
                <p>Utilize ferramentas avançadas de análise para extrair insights valiosos e orientar suas decisões estratégicas.</p>
              </div>
            </div>
          </div>
          <div class="cta-center">
            <a href="/signup" class="btn btn-primary">Comece Agora</a>
          </div>
        </div>
      </section>
    `;

    // Initialize animations
    this.initializeAnimations();
  }

  initializeAnimations() {
    const elementsToAnimate = this.element.querySelectorAll('.benefit-card, .step, .section-header:not(.hero .section-header), .hero-content');
    
    elementsToAnimate.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const animateOnScroll = () => {
      elementsToAnimate.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
  }

  unmount() {
    window.removeEventListener('scroll', this.animateOnScroll);
  }
}

export default Home;