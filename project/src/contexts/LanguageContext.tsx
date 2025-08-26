import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.services': 'Servizi',
    'nav.webDesign': 'Web Design',
    'nav.seo': 'SEO',
    'nav.branding': 'Branding',
    'nav.maintenance': 'Manutenzione',
    'nav.students': 'Studenti',
    'nav.contact': 'Contatti',
    'nav.consultation': 'Consulenza Gratuita',

    // Common
    'common.getStarted': 'Inizia Ora',
    'common.learnMore': 'Scopri di Più',
    'common.viewDetails': 'Vedi Dettagli',
    'common.mostPopular': 'Più Popolare',
    'common.contactUs': 'Contattaci',
    'common.readMore': 'Leggi di Più',
    'common.viewAll': 'Vedi Tutti',

    // Home Page
    'home.badge': '🚀 Studio Creativo Digitale',
    'home.hero.title1': 'Trasformiamo le tue idee in',
    'home.hero.title2': 'esperienze digitali straordinarie',
    'home.hero.subtitle': 'Creiamo siti web, strategie SEO e identità di brand che convertono visitatori in clienti e fanno crescere il tuo business online.',
    'home.hero.cta1': 'Inizia il Tuo Progetto',
    'home.hero.cta2': 'Pianifica il Tuo Sito',
    'home.stats.projects': 'Progetti',
    'home.stats.clients': 'Clienti',
    'home.stats.rating': 'Rating',

    'home.services.badge': 'I Nostri Servizi',
    'home.services.title': 'Soluzioni Complete per il Tuo Successo Digitale',
    'home.services.subtitle': 'Dalla progettazione alla realizzazione, ti accompagniamo in ogni fase del tuo percorso digitale.',
    'home.services.web.title': 'Siti Web & Sviluppo',
    'home.services.web.desc': 'Siti web moderni, responsive e ottimizzati per le conversioni',
    'home.services.web.price': 'da 1.200€',
    'home.services.seo.title': 'SEO & Marketing',
    'home.services.seo.desc': 'Posizionamento sui motori di ricerca e strategie di marketing digitale',
    'home.services.seo.price': 'da 500€/mese',
    'home.services.branding.title': 'Branding & Grafica',
    'home.services.branding.desc': 'Identità visiva completa e materiali di comunicazione professionali',
    'home.services.branding.price': 'da 800€',
    'home.services.cta': 'Richiedi Preventivo',
    'home.services.viewAll': 'Vedi Tutti i Servizi',

    'home.pricing.badge': 'Prezzi Trasparenti',
    'home.pricing.title': 'Investimenti Chiari, Risultati Garantiti',
    'home.pricing.subtitle': 'Nessun costo nascosto. Prezzi fissi e trasparenti per ogni tipo di progetto.',
    'home.pricing.web.title': 'Siti Web Professionali',
    'home.pricing.web.desc': 'Da landing page a e-commerce completi, prezzi chiari da 1.200€',
    'home.pricing.seo.title': 'Servizi SEO Mensili',
    'home.pricing.seo.desc': 'Piani di ottimizzazione continua a partire da 500€/mese',
    'home.pricing.note': 'Tutti i prezzi sono IVA esclusa. Preventivi personalizzati disponibili.',

    'home.why.badge': 'Perché Sceglierci',
    'home.why.title': 'La Differenza che Fa la Differenza',
    'home.why.subtitle': 'Oltre 100 progetti realizzati con successo per clienti in tutta Europa.',
    'home.why.design.title': 'Design d\'Eccellenza',
    'home.why.design.desc': 'Ogni progetto è unico, studiato per riflettere la personalità del tuo brand',
    'home.why.team.title': 'Team Esperto',
    'home.why.team.desc': 'Professionisti specializzati in design, sviluppo e marketing digitale',
    'home.why.delivery.title': 'Consegna Puntuale',
    'home.why.delivery.desc': 'Rispettiamo sempre le scadenze concordate, senza compromessi sulla qualità',

    'home.process.badge': 'Il Nostro Processo',
    'home.process.title': 'Come Lavoriamo Insieme',
    'home.process.subtitle': 'Un processo collaudato che garantisce risultati eccellenti in ogni progetto.',
    'home.process.discovery.title': 'Scoperta',
    'home.process.discovery.desc': 'Analizziamo i tuoi obiettivi e definiamo la strategia migliore',
    'home.process.design.title': 'Design',
    'home.process.design.desc': 'Creiamo mockup e prototipi per visualizzare il risultato finale',
    'home.process.development.title': 'Sviluppo',
    'home.process.development.desc': 'Realizziamo il progetto con tecnologie moderne e affidabili',
    'home.process.launch.title': 'Lancio',
    'home.process.launch.desc': 'Pubblichiamo online e ti supportiamo nella fase di avvio',

    'home.testimonials.badge': 'Testimonianze',
    'home.testimonials.title': 'Cosa Dicono i Nostri Clienti',
    'home.testimonials.subtitle': 'La soddisfazione dei nostri clienti è la nostra migliore referenza.',

    'home.cta.badge': 'Inizia Oggi',
    'home.cta.title': 'Pronto a Trasformare la Tua Presenza Digitale?',
    'home.cta.subtitle': 'Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a raggiungere i tuoi obiettivi.',
    'home.cta.start': 'Inizia il Tuo Progetto',
    'home.cta.portfolio': 'Vedi il Portfolio',

    // Contact Page
    'contact.badge': 'Contattaci',
    'contact.title': 'Iniziamo a Lavorare Insieme',
    'contact.subtitle': 'Raccontaci il tuo progetto e ricevi una consulenza personalizzata gratuita entro 24 ore.',
    'contact.form.title': 'Invia la Tua Richiesta',
    'contact.form.subtitle': 'Compila il form per ricevere un preventivo dettagliato',
    'contact.form.name': 'Nome e Cognome',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Telefono',
    'contact.form.company': 'Azienda',
    'contact.form.service': 'Servizio di Interesse',
    'contact.form.budget': 'Budget Indicativo',
    'contact.form.message': 'Messaggio',
    'contact.form.send': 'Invia Richiesta',
    'contact.form.sending': 'Invio in corso...',

    // Web Design Page
    'webdesign.badge': 'Web Design & Sviluppo',
    'webdesign.hero.title': 'Siti Web che Convertono e Impressionano',
    'webdesign.hero.subtitle': 'Creiamo esperienze digitali uniche che trasformano i visitatori in clienti fedeli, con design moderni e tecnologie all\'avanguardia.',
    'webdesign.hero.cta1': 'Inizia il Tuo Progetto',
    'webdesign.hero.cta2': 'Vedi i Nostri Lavori',

    'webdesign.features.title': 'Caratteristiche dei Nostri Siti Web',
    'webdesign.features.subtitle': 'Ogni sito che realizziamo è progettato per offrire prestazioni eccellenti e risultati concreti.',
    'webdesign.features.design.title': 'Design Personalizzato',
    'webdesign.features.design.desc': 'Ogni progetto è unico e riflette l\'identità del tuo brand',
    'webdesign.features.responsive.title': 'Responsive Design',
    'webdesign.features.responsive.desc': 'Perfetto su tutti i dispositivi, dal mobile al desktop',
    'webdesign.features.code.title': 'Codice Pulito',
    'webdesign.features.code.desc': 'Sviluppo con le migliori pratiche per prestazioni ottimali',
    'webdesign.features.performance.title': 'Alte Prestazioni',
    'webdesign.features.performance.desc': 'Caricamento veloce e ottimizzazione SEO inclusa',

    'webdesign.pricing.badge': 'Pacchetti e Prezzi',
    'webdesign.pricing.title': 'Soluzioni per Ogni Esigenza',
    'webdesign.pricing.subtitle': 'Scegli il pacchetto più adatto al tuo business, con prezzi trasparenti e senza sorprese.',

    'webdesign.packages.starter.name': 'Starter',
    'webdesign.packages.starter.desc': 'Perfetto per piccole attività e professionisti',
    'webdesign.packages.starter.feature1': 'Fino a 5 pagine',
    'webdesign.packages.starter.feature2': 'Design responsive',
    'webdesign.packages.starter.feature3': 'Form di contatto',
    'webdesign.packages.starter.feature4': 'SEO base',
    'webdesign.packages.starter.feature5': 'Supporto 30 giorni',
    'webdesign.packages.starter.feature6': 'Hosting incluso 1 anno',

    'webdesign.packages.professional.name': 'Professional',
    'webdesign.packages.professional.desc': 'Ideale per aziende che vogliono crescere online',
    'webdesign.packages.professional.feature1': 'Fino a 10 pagine',
    'webdesign.packages.professional.feature2': 'Design avanzato',
    'webdesign.packages.professional.feature3': 'CMS personalizzato',
    'webdesign.packages.professional.feature4': 'SEO avanzato',
    'webdesign.packages.professional.feature5': 'Analytics integrati',
    'webdesign.packages.professional.feature6': 'Supporto 60 giorni',
    'webdesign.packages.professional.feature7': 'Training incluso',

    'webdesign.packages.enterprise.name': 'Enterprise',
    'webdesign.packages.enterprise.price': 'Su Misura',
    'webdesign.packages.enterprise.desc': 'Soluzioni complete per grandi progetti',
    'webdesign.packages.enterprise.feature1': 'Pagine illimitate',
    'webdesign.packages.enterprise.feature2': 'Funzionalità custom',
    'webdesign.packages.enterprise.feature3': 'Integrazioni API',
    'webdesign.packages.enterprise.feature4': 'SEO enterprise',
    'webdesign.packages.enterprise.feature5': 'Supporto prioritario',
    'webdesign.packages.enterprise.feature6': 'Manutenzione inclusa',
    'webdesign.packages.enterprise.feature7': 'Consulenza strategica',

    'webdesign.process.badge': 'Il Nostro Processo',
    'webdesign.process.title': 'Come Realizziamo il Tuo Sito',
    'webdesign.process.subtitle': 'Un approccio strutturato che garantisce risultati eccellenti.',
    'webdesign.process.discovery.title': 'Analisi e Strategia',
    'webdesign.process.discovery.desc': 'Studiamo il tuo business e definiamo obiettivi chiari',
    'webdesign.process.design.title': 'Design e Prototipo',
    'webdesign.process.design.desc': 'Creiamo mockup dettagliati per ogni pagina',
    'webdesign.process.development.title': 'Sviluppo e Test',
    'webdesign.process.development.desc': 'Codifichiamo e testiamo ogni funzionalità',
    'webdesign.process.launch.title': 'Lancio e Supporto',
    'webdesign.process.launch.desc': 'Pubblichiamo online e ti formiamo sull\'uso',

    'webdesign.testimonials.badge': 'Testimonianze',
    'webdesign.testimonials.title': 'Cosa Dicono i Nostri Clienti',
    'webdesign.testimonials.testimonial1': 'Il team di Mixim ha superato ogni aspettativa. Il nostro nuovo sito ha triplicato le conversioni!',
    'webdesign.testimonials.testimonial2': 'Professionalità e creatività al top. Hanno capito perfettamente la nostra visione.',
    'webdesign.testimonials.testimonial3': 'Risultati straordinari in tempi record. Consiglio vivamente Mixim per qualsiasi progetto web.',

    'webdesign.cta.title': 'Pronto a Lanciare il Tuo Nuovo Sito?',
    'webdesign.cta.subtitle': 'Contattaci oggi per una consulenza gratuita e scopri come possiamo trasformare la tua presenza online.',
    'webdesign.cta.cta1': 'Inizia il Tuo Progetto',
    'webdesign.cta.cta2': 'Vedi Altri Progetti',

    // SEO Page
    'seo.badge': 'SEO & Marketing Digitale',
    'seo.hero.title': 'Porta il Tuo Sito in Prima Pagina su Google',
    'seo.hero.subtitle': 'Strategie SEO comprovate che aumentano la visibilità online, generano traffico qualificato e trasformano i visitatori in clienti.',
    'seo.hero.cta1': 'Analisi SEO Gratuita',
    'seo.hero.cta2': 'Vedi i Risultati',

    'seo.results.title': 'Risultati Concreti per i Nostri Clienti',
    'seo.results.subtitle': 'Dati reali dai progetti che abbiamo ottimizzato negli ultimi 12 mesi.',
    'seo.results.traffic': 'Aumento Traffico Organico',
    'seo.results.rankings': 'Miglioramento Posizioni',
    'seo.results.leads': 'Incremento Lead Qualificati',
    'seo.results.conversions': 'Crescita Conversioni',

    'seo.services.title': 'I Nostri Servizi SEO',
    'seo.services.subtitle': 'Strategie complete per dominare i risultati di ricerca.',
    'seo.services.keyword.title': 'Ricerca Parole Chiave',
    'seo.services.keyword.desc': 'Identifichiamo le keyword più profittevoli per il tuo business',
    'seo.services.onpage.title': 'Ottimizzazione On-Page',
    'seo.services.onpage.desc': 'Ottimizziamo contenuti, meta tag e struttura del sito',
    'seo.services.technical.title': 'SEO Tecnico',
    'seo.services.technical.desc': 'Miglioriamo velocità, crawlability e user experience',
    'seo.services.tracking.title': 'Monitoraggio e Report',
    'seo.services.tracking.desc': 'Tracciamo i progressi con report dettagliati mensili',

    'seo.pricing.badge': 'Piani SEO',
    'seo.pricing.title': 'Piani di Ottimizzazione Continua',
    'seo.pricing.subtitle': 'Scegli il piano più adatto alle tue esigenze e budget.',

    'seo.packages.single.name': 'SEO Locale',
    'seo.packages.single.price': '500€/mese',
    'seo.packages.single.desc': 'Perfetto per attività locali e piccole aziende',
    'seo.packages.single.feature1': 'Ottimizzazione fino a 25 pagine',
    'seo.packages.single.feature2': 'Ricerca parole chiave avanzata',
    'seo.packages.single.feature3': 'Link building',
    'seo.packages.single.feature4': 'Content marketing',
    'seo.packages.single.feature5': 'Report settimanali',

    'seo.packages.local.name': 'SEO Locale',
    'seo.packages.local.price': '€270 - €390/mese',
    'seo.packages.local.desc': 'Perfetto per attività locali e piccole aziende',
    'seo.packages.local.feature1': 'Ottimizzazione fino a 10 pagine',
    'seo.packages.local.feature2': 'Ricerca parole chiave locali',
    'seo.packages.local.feature3': 'Google My Business',
    'seo.packages.local.feature4': 'Report mensili',
    'seo.packages.local.feature5': 'Supporto email',

    'seo.packages.enterprise.name': 'SEO Enterprise',
    'seo.packages.enterprise.price': '€720 - €1.040/mese',
    'seo.packages.enterprise.desc': 'Soluzioni complete per grandi aziende',
    'seo.packages.enterprise.feature1': 'Ottimizzazione illimitata',
    'seo.packages.enterprise.feature2': 'Strategia SEO completa',
    'seo.packages.enterprise.feature3': 'Competitor analysis',
    'seo.packages.enterprise.feature4': 'Consulenza strategica',
    'seo.packages.enterprise.feature5': 'Supporto prioritario',

    'seo.process.badge': 'Il Nostro Processo',
    'seo.process.title': 'Come Ottimizziamo il Tuo Sito',
    'seo.process.subtitle': 'Un approccio strutturato per risultati garantiti.',
    'seo.process.audit.title': 'Audit SEO',
    'seo.process.audit.desc': 'Analizziamo il tuo sito e la concorrenza',
    'seo.process.strategy.title': 'Strategia',
    'seo.process.strategy.desc': 'Definiamo la strategia SEO personalizzata',
    'seo.process.implementation.title': 'Implementazione',
    'seo.process.implementation.desc': 'Applichiamo le ottimizzazioni tecniche e contenuti',
    'seo.process.monitor.title': 'Monitoraggio',
    'seo.process.monitor.desc': 'Tracciamo i risultati e ottimizziamo continuamente',

    'seo.testimonials.badge': 'Testimonianze',
    'seo.testimonials.title': 'Cosa Dicono i Nostri Clienti',
    'seo.testimonials.testimonial1': 'Grazie a Mixim il nostro ristorante è ora in prima pagina su Google. Le prenotazioni sono triplicate!',
    'seo.testimonials.testimonial2': 'Risultati incredibili in soli 3 mesi. Il traffico organico è aumentato del 300%.',
    'seo.testimonials.testimonial3': 'Professionalità e competenza. Hanno trasformato la nostra presenza online.',

    'seo.cta.title': 'Pronto a Dominare Google?',
    'seo.cta.subtitle': 'Contattaci per un\'analisi SEO gratuita e scopri come possiamo portare il tuo sito in prima pagina.',
    'seo.cta.cta1': 'Analisi SEO Gratuita',
    'seo.cta.cta2': 'Vedi i Risultati',

    // Students Page
    'students.badge': 'Per Studenti',
    'students.title': 'CV Digitali per Studenti',
    'students.subtitle': 'Crea un CV online professionale che ti distingua dalla concorrenza',
    'students.discount': 'Sconto 25% Studenti',
    'students.cta.primary': 'Crea il Tuo CV',
    'students.final.whatsapp': 'Chatta su WhatsApp',

    'students.why.title': 'Perché un CV Online?',
    'students.why.subtitle': 'Il futuro del recruiting è digitale',
    'students.why.accessible': 'Accessibile ovunque, 24/7',
    'students.why.updatable': 'Aggiornabile in qualsiasi momento',
    'students.why.modern': 'Design moderno e mobile-friendly',

    'students.how.title': 'Come Funziona',
    'students.how.subtitle': 'Semplice, veloce, professionale',
    'students.how.step1': 'Invia le tue informazioni',
    'students.how.step2': 'Personalizzazione grafica',
    'students.how.step3': 'Pubblicazione online',

    'students.offer.title': 'Offerta Speciale Studenti',
    'students.offer.subtitle': 'Investiamo nel vostro futuro',

    'students.examples.title': 'Esempi di CV Online',
    'students.examples.subtitle': 'Scegli lo stile che ti rappresenta',

    'students.pricing.title': 'Prezzi Speciali Studenti',
    'students.pricing.subtitle': 'Qualità professionale a prezzi accessibili',

    // English translations
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.services': 'Services',
    'nav.webDesign': 'Web Design',
    'nav.seo': 'SEO',
    'nav.branding': 'Branding',
    'nav.maintenance': 'Maintenance',
    'nav.students': 'Students',
    'nav.contact': 'Contact',
    'nav.consultation': 'Free Consultation',

    // Common
    'common.getStarted': 'Get Started',
    'common.learnMore': 'Learn More',
    'common.viewDetails': 'View Details',
    'common.mostPopular': 'Most Popular',
    'common.contactUs': 'Contact Us',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',

    // Home Page
    'home.badge': '🚀 Digital Creative Studio',
    'home.hero.title1': 'We transform your ideas into',
    'home.hero.title2': 'extraordinary digital experiences',
    'home.hero.subtitle': 'We create websites, SEO strategies and brand identities that convert visitors into customers and grow your online business.',
    'home.hero.cta1': 'Start Your Project',
    'home.hero.cta2': 'Plan Your Website',
    'home.stats.projects': 'Projects',
    'home.stats.clients': 'Clients',
    'home.stats.rating': 'Rating',

    'home.services.badge': 'Our Services',
    'home.services.title': 'Complete Solutions for Your Digital Success',
    'home.services.subtitle': 'From design to implementation, we accompany you in every phase of your digital journey.',
    'home.services.web.title': 'Websites & Development',
    'home.services.web.desc': 'Modern, responsive websites optimized for conversions',
    'home.services.web.price': 'from €1,200',
    'home.services.seo.title': 'SEO & Marketing',
    'home.services.seo.desc': 'Search engine positioning and digital marketing strategies',
    'home.services.seo.price': 'from €500/month',
    'home.services.branding.title': 'Branding & Graphics',
    'home.services.branding.desc': 'Complete visual identity and professional communication materials',
    'home.services.branding.price': 'from €800',
    'home.services.cta': 'Request Quote',
    'home.services.viewAll': 'View All Services',

    'home.pricing.badge': 'Transparent Pricing',
    'home.pricing.title': 'Clear Investments, Guaranteed Results',
    'home.pricing.subtitle': 'No hidden costs. Fixed and transparent prices for every type of project.',
    'home.pricing.web.title': 'Professional Websites',
    'home.pricing.web.desc': 'From landing pages to complete e-commerce, clear prices from €1,200',
    'home.pricing.seo.title': 'Monthly SEO Services',
    'home.pricing.seo.desc': 'Continuous optimization plans starting from €500/month',
    'home.pricing.note': 'All prices exclude VAT. Custom quotes available.',

    'home.why.badge': 'Why Choose Us',
    'home.why.title': 'The Difference That Makes the Difference',
    'home.why.subtitle': 'Over 100 projects successfully completed for clients throughout Europe.',
    'home.why.design.title': 'Excellence in Design',
    'home.why.design.desc': 'Every project is unique, designed to reflect your brand personality',
    'home.why.team.title': 'Expert Team',
    'home.why.team.desc': 'Professionals specialized in design, development and digital marketing',
    'home.why.delivery.title': 'Timely Delivery',
    'home.why.delivery.desc': 'We always respect agreed deadlines, without compromising on quality',

    'home.process.badge': 'Our Process',
    'home.process.title': 'How We Work Together',
    'home.process.subtitle': 'A proven process that guarantees excellent results in every project.',
    'home.process.discovery.title': 'Discovery',
    'home.process.discovery.desc': 'We analyze your goals and define the best strategy',
    'home.process.design.title': 'Design',
    'home.process.design.desc': 'We create mockups and prototypes to visualize the final result',
    'home.process.development.title': 'Development',
    'home.process.development.desc': 'We realize the project with modern and reliable technologies',
    'home.process.launch.title': 'Launch',
    'home.process.launch.desc': 'We publish online and support you in the launch phase',

    'home.testimonials.badge': 'Testimonials',
    'home.testimonials.title': 'What Our Clients Say',
    'home.testimonials.subtitle': 'Our clients\' satisfaction is our best reference.',

    'home.cta.badge': 'Start Today',
    'home.cta.title': 'Ready to Transform Your Digital Presence?',
    'home.cta.subtitle': 'Contact us for a free consultation and discover how we can help you achieve your goals.',
    'home.cta.start': 'Start Your Project',
    'home.cta.portfolio': 'View Portfolio',

    // Contact Page
    'contact.badge': 'Contact Us',
    'contact.title': 'Let\'s Start Working Together',
    'contact.subtitle': 'Tell us about your project and receive personalized consultation within 24 hours.',
    'contact.form.title': 'Send Your Request',
    'contact.form.subtitle': 'Fill out the form to receive a detailed quote',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.company': 'Company',
    'contact.form.service': 'Service of Interest',
    'contact.form.budget': 'Indicative Budget',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Request',
    'contact.form.sending': 'Sending...',

    // Web Design Page
    'webdesign.badge': 'Web Design & Development',
    'webdesign.hero.title': 'Websites that Convert and Impress',
    'webdesign.hero.subtitle': 'We create unique digital experiences that transform visitors into loyal customers, with modern designs and cutting-edge technologies.',
    'webdesign.hero.cta1': 'Start Your Project',
    'webdesign.hero.cta2': 'View Our Work',

    'webdesign.features.title': 'Features of Our Websites',
    'webdesign.features.subtitle': 'Every website we create is designed to offer excellent performance and concrete results.',
    'webdesign.features.design.title': 'Custom Design',
    'webdesign.features.design.desc': 'Every project is unique and reflects your brand identity',
    'webdesign.features.responsive.title': 'Responsive Design',
    'webdesign.features.responsive.desc': 'Perfect on all devices, from mobile to desktop',
    'webdesign.features.code.title': 'Clean Code',
    'webdesign.features.code.desc': 'Development with best practices for optimal performance',
    'webdesign.features.performance.title': 'High Performance',
    'webdesign.features.performance.desc': 'Fast loading and SEO optimization included',

    'webdesign.pricing.badge': 'Packages and Pricing',
    'webdesign.pricing.title': 'Solutions for Every Need',
    'webdesign.pricing.subtitle': 'Choose the package that best suits your business, with transparent prices and no surprises.',

    'webdesign.packages.starter.name': 'Starter',
    'webdesign.packages.starter.desc': 'Perfect for small businesses and professionals',
    'webdesign.packages.starter.feature1': 'Up to 5 pages',
    'webdesign.packages.starter.feature2': 'Responsive design',
    'webdesign.packages.starter.feature3': 'Contact form',
    'webdesign.packages.starter.feature4': 'Basic SEO',
    'webdesign.packages.starter.feature5': '30 days support',
    'webdesign.packages.starter.feature6': '1 year hosting included',

    'webdesign.packages.professional.name': 'Professional',
    'webdesign.packages.professional.desc': 'Ideal for companies that want to grow online',
    'webdesign.packages.professional.feature1': 'Up to 10 pages',
    'webdesign.packages.professional.feature2': 'Advanced design',
    'webdesign.packages.professional.feature3': 'Custom CMS',
    'webdesign.packages.professional.feature4': 'Advanced SEO',
    'webdesign.packages.professional.feature5': 'Integrated analytics',
    'webdesign.packages.professional.feature6': '60 days support',
    'webdesign.packages.professional.feature7': 'Training included',

    'webdesign.packages.enterprise.name': 'Enterprise',
    'webdesign.packages.enterprise.price': 'Custom',
    'webdesign.packages.enterprise.desc': 'Complete solutions for large projects',
    'webdesign.packages.enterprise.feature1': 'Unlimited pages',
    'webdesign.packages.enterprise.feature2': 'Custom features',
    'webdesign.packages.enterprise.feature3': 'API integrations',
    'webdesign.packages.enterprise.feature4': 'Enterprise SEO',
    'webdesign.packages.enterprise.feature5': 'Priority support',
    'webdesign.packages.enterprise.feature6': 'Maintenance included',
    'webdesign.packages.enterprise.feature7': 'Strategic consulting',

    'webdesign.process.badge': 'Our Process',
    'webdesign.process.title': 'How We Create Your Website',
    'webdesign.process.subtitle': 'A structured approach that guarantees excellent results.',
    'webdesign.process.discovery.title': 'Analysis and Strategy',
    'webdesign.process.discovery.desc': 'We study your business and define clear objectives',
    'webdesign.process.design.title': 'Design and Prototype',
    'webdesign.process.design.desc': 'We create detailed mockups for every page',
    'webdesign.process.development.title': 'Development and Testing',
    'webdesign.process.development.desc': 'We code and test every functionality',
    'webdesign.process.launch.title': 'Launch and Support',
    'webdesign.process.launch.desc': 'We publish online and train you on usage',

    'webdesign.testimonials.badge': 'Testimonials',
    'webdesign.testimonials.title': 'What Our Clients Say',
    'webdesign.testimonials.testimonial1': 'The Mixim team exceeded every expectation. Our new website tripled conversions!',
    'webdesign.testimonials.testimonial2': 'Top professionalism and creativity. They perfectly understood our vision.',
    'webdesign.testimonials.testimonial3': 'Extraordinary results in record time. I highly recommend Mixim for any web project.',

    'webdesign.cta.title': 'Ready to Launch Your New Website?',
    'webdesign.cta.subtitle': 'Contact us today for a free consultation and discover how we can transform your online presence.',
    'webdesign.cta.cta1': 'Start Your Project',
    'webdesign.cta.cta2': 'View Other Projects',

    // SEO Page
    'seo.badge': 'SEO & Digital Marketing',
    'seo.hero.title': 'Get Your Website to Google\'s First Page',
    'seo.hero.subtitle': 'Proven SEO strategies that increase online visibility, generate qualified traffic and transform visitors into customers.',
    'seo.hero.cta1': 'Free SEO Analysis',
    'seo.hero.cta2': 'View Results',

    'seo.results.title': 'Concrete Results for Our Clients',
    'seo.results.subtitle': 'Real data from projects we\'ve optimized in the last 12 months.',
    'seo.results.traffic': 'Organic Traffic Increase',
    'seo.results.rankings': 'Position Improvement',
    'seo.results.leads': 'Qualified Leads Increase',
    'seo.results.conversions': 'Conversion Growth',

    'seo.services.title': 'Our SEO Services',
    'seo.services.subtitle': 'Complete strategies to dominate search results.',
    'seo.services.keyword.title': 'Keyword Research',
    'seo.services.keyword.desc': 'We identify the most profitable keywords for your business',
    'seo.services.onpage.title': 'On-Page Optimization',
    'seo.services.onpage.desc': 'We optimize content, meta tags and site structure',
    'seo.services.technical.title': 'Technical SEO',
    'seo.services.technical.desc': 'We improve speed, crawlability and user experience',
    'seo.services.tracking.title': 'Monitoring and Reports',
    'seo.services.tracking.desc': 'We track progress with detailed monthly reports',

    'seo.pricing.badge': 'SEO Plans',
    'seo.pricing.title': 'Continuous Optimization Plans',
    'seo.pricing.subtitle': 'Choose the plan that best fits your needs and budget.',

    'seo.packages.local.name': 'Local SEO',
    'seo.packages.local.price': '€270 - €390/month',
    'seo.packages.local.desc': 'Perfect for local businesses and small companies',
    'seo.packages.local.feature1': 'Optimization up to 10 pages',
    'seo.packages.local.feature2': 'Local keyword research',
    'seo.packages.local.feature3': 'Google My Business',
    'seo.packages.local.feature4': 'Monthly reports',
    'seo.packages.local.feature5': 'Email support',

    'seo.packages.single.name': 'National SEO',
    'seo.packages.single.price': '€450 - €650/month',
    'seo.packages.single.desc': 'Ideal for companies wanting to grow nationally',
    'seo.packages.single.feature1': 'Optimization up to 25 pages',
    'seo.packages.single.feature2': 'Advanced keyword research',
    'seo.packages.single.feature3': 'Link building',
    'seo.packages.single.feature4': 'Content marketing',
    'seo.packages.single.feature5': 'Weekly reports',

    'seo.packages.enterprise.name': 'Enterprise SEO',
    'seo.packages.enterprise.price': '€720 - €1,040/month',
    'seo.packages.enterprise.desc': 'Complete solutions for large companies',
    'seo.packages.enterprise.feature1': 'Unlimited optimization',
    'seo.packages.enterprise.feature2': 'Complete SEO strategy',
    'seo.packages.enterprise.feature3': 'Competitor analysis',
    'seo.packages.enterprise.feature4': 'Strategic consulting',
    'seo.packages.enterprise.feature5': 'Priority support',

    'seo.process.badge': 'Our Process',
    'seo.process.title': 'How We Optimize Your Site',
    'seo.process.subtitle': 'A structured approach for guaranteed results.',
    'seo.process.audit.title': 'SEO Audit',
    'seo.process.audit.desc': 'We analyze your site and competition',
    'seo.process.strategy.title': 'Strategy',
    'seo.process.strategy.desc': 'We define personalized SEO strategy',
    'seo.process.implementation.title': 'Implementation',
    'seo.process.implementation.desc': 'We apply technical optimizations and content',
    'seo.process.monitor.title': 'Monitoring',
    'seo.process.monitor.desc': 'We track results and continuously optimize',

    'seo.testimonials.badge': 'Testimonials',
    'seo.testimonials.title': 'What Our Clients Say',
    'seo.testimonials.testimonial1': 'Thanks to Mixim our restaurant is now on Google\'s first page. Bookings have tripled!',
    'seo.testimonials.testimonial2': 'Incredible results in just 3 months. Organic traffic increased by 300%.',
    'seo.testimonials.testimonial3': 'Professionalism and expertise. They transformed our online presence.',

    'seo.cta.title': 'Ready to Dominate Google?',
    'seo.cta.subtitle': 'Contact us for a free SEO analysis and discover how we can get your site to the first page.',
    'seo.cta.cta1': 'Free SEO Analysis',
    'seo.cta.cta2': 'View Results',

    // Students Page
    'students.badge': 'For Students',
    'students.title': 'Digital CVs for Students',
    'students.subtitle': 'Create a professional online CV that sets you apart from the competition',
    'students.discount': '25% Student Discount',
    'students.cta.primary': 'Create Your CV',
    'students.final.whatsapp': 'Chat on WhatsApp',

    'students.why.title': 'Why an Online CV?',
    'students.why.subtitle': 'The future of recruiting is digital',
    'students.why.accessible': 'Accessible anywhere, 24/7',
    'students.why.updatable': 'Updatable anytime',
    'students.why.modern': 'Modern and mobile-friendly design',

    'students.how.title': 'How It Works',
    'students.how.subtitle': 'Simple, fast, professional',
    'students.how.step1': 'Send your information',
    'students.how.step2': 'Graphic customization',
    'students.how.step3': 'Online publication',

    'students.offer.title': 'Special Student Offer',
    'students.offer.subtitle': 'We invest in your future',

    'students.examples.title': 'Online CV Examples',
    'students.examples.subtitle': 'Choose the style that represents you',

    'students.pricing.title': 'Special Student Prices',
    'students.pricing.subtitle': 'Professional quality at accessible prices'
  }
}