import { motion } from 'framer-motion';
import { GraduationCap, Globe, Smartphone, RefreshCw, Users, Zap, ArrowRight, CheckCircle, Star, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Students() {
  const { t } = useLanguage();

  const scrollToContact = () => {
    window.location.href = '/contact';
  };

  const benefits = [
    {
      icon: <Globe className="h-6 w-6" />,
      key: "accessible",
      description: "Il tuo CV sempre online, visibile da qualsiasi dispositivo in qualsiasi momento"
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      key: "updatable",
      description: "Modifica e aggiorna le tue informazioni senza dover ristampare nulla"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      key: "modern",
      description: "Ottimizzato per tutti i dispositivi, con design accattivante e professionale"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Invia le tue informazioni",
      description: "Condividi con noi testo, foto, esperienze e competenze da includere nel tuo CV digitale"
    },
    {
      step: "02",
      title: "Personalizzazione grafica",
      description: "Creiamo il design personalizzato e ottimizziamo tutto per il web e i motori di ricerca"
    },
    {
      step: "03",
      title: "Pubblicazione online",
      description: "Ricevi il link personale del tuo CV digitale, pronto da condividere con recruiter e aziende"
    }
  ];

  const cvExamples = [
    {
      title: "CV Creativo - Designer",
      description: "Layout moderno per profili creativi con portfolio integrato",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Portfolio integrato", "Animazioni eleganti", "Sezione progetti"]
    },
    {
      title: "CV Professionale - Business",
      description: "Design pulito e professionale per ruoli corporate e manageriali",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Layout corporate", "Grafici competenze", "Timeline esperienze"]
    },
    {
      title: "CV Tech - Sviluppatori",
      description: "Template ottimizzato per profili IT e sviluppatori",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Showcase progetti", "Skills tecniche", "Link GitHub/LinkedIn"]
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20">
              <GraduationCap className="h-4 w-4 mr-2" />
              {t('students.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('students.title')}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              {t('students.subtitle')}
            </p>
            
            {/* Highlight Sconto */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/30 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-2">
                <GraduationCap className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-2xl font-bold text-green-400">{t('students.discount')}</span>
              </div>
              <p className="text-gray-300 text-sm">Su tutti i pacchetti CV digitali - Verifica con documento studente</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              >
                {t('students.cta.primary')}
              </Button>
              <Link to="/portfolio">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg"
                >
                  {t('students.final.whatsapp')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Perché un CV Online */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('students.why.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">
              {t('students.why.subtitle')} Con una landing page dedicata, il tuo profilo sarà sempre accessibile da qualsiasi dispositivo, 
              pronto a catturare l'attenzione di HR e recruiter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1a1a1b] border-gray-800 text-center p-6 h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center text-purple-500">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{t(`students.why.${benefit.key}`)}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Come Funziona */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
              Processo Semplice
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('students.how.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('students.how.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-700 to-transparent -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t(`students.how.step${index + 1}`)}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Offerta Speciale Studenti */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-green-900/20 to-purple-900/20 border-green-800/50 p-8">
              <div className="text-center mb-8">
                <GraduationCap className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('students.offer.title')}
                </h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-300 text-center mb-8">
                  {t('students.offer.subtitle')} Crediamo che i giovani meritino strumenti accessibili per costruire una presenza online forte e moderna. 
                  Il tuo CV non sarà più un semplice PDF, ma un biglietto da visita digitale pronto a fare colpo.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">25%</div>
                    <div className="text-sm text-gray-400">Sconto Studenti</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">48h</div>
                    <div className="text-sm text-gray-400">Consegna Rapida</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">∞</div>
                    <div className="text-sm text-gray-400">Aggiornamenti Inclusi</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Esempi CV Online */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-500/10 text-pink-400 border-pink-500/20">
              Portfolio CV
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('students.examples.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('students.examples.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cvExamples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1a1a1b] border-gray-800 overflow-hidden group cursor-pointer h-full">
                  <div className="relative h-48">
                    <img
                      src={example.image}
                      alt={example.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-4 left-4 bg-black/80 text-white border-gray-600">
                      CV Template
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{example.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{example.description}</p>
                    <ul className="space-y-1 mb-4">
                      {example.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:border-purple-500 group-hover:text-purple-400"
                      onClick={scrollToContact}
                    >
                      Richiedi Questo Stile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing per Studenti */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
              Prezzi Studenti
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('students.pricing.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('students.pricing.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#1a1a1b] border-gray-800 relative overflow-hidden h-full">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-white text-xl mb-2">CV Essenziale</CardTitle>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 line-through">Prezzo normale: 400€</div>
                    <div className="text-3xl font-bold text-green-400">€270 - €390</div>
                    <div className="text-sm text-green-400">Sconto studenti: -25%</div>
                  </div>
                  <CardDescription className="text-gray-400">
                    CV digitale professionale con design moderno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Landing page CV responsive",
                      "Design personalizzato",
                      "Sezioni: About, Esperienza, Skills",
                      "Form di contatto integrato",
                      "Ottimizzazione SEO base",
                      "Link personale (tuonome.cv.com)",
                      "1 revisione inclusa"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gray-700 hover:bg-gray-600"
                    onClick={scrollToContact}
                  >
                    Scegli Essenziale
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-b from-purple-900/20 to-pink-900/20 border-purple-600 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-medium">
                  Più Popolare
                </div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-white text-xl mb-2">CV Premium</CardTitle>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 line-through">Prezzo normale: 600€</div>
                    <div className="text-3xl font-bold text-purple-400">€405 - €585</div>
                    <div className="text-sm text-purple-400">Sconto studenti: -25%</div>
                  </div>
                  <CardDescription className="text-gray-400">
                    CV completo con portfolio e funzionalità avanzate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Tutto del pacchetto Essenziale",
                      "Sezione Portfolio/Progetti",
                      "Galleria immagini interattiva",
                      "Animazioni e micro-interazioni",
                      "Integrazione social media",
                      "Analytics e statistiche visite",
                      "Download CV PDF automatico",
                      "3 revisioni incluse",
                      "Supporto 6 mesi"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-purple-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={scrollToContact}
                  >
                    Scegli Premium
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Finale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-800/50 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Trasforma il tuo CV in un'esperienza digitale
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Non lasciare che il tuo talento passi inosservato. Crea un CV digitale che ti distingua 
              dalla concorrenza e catturi l'attenzione dei recruiter più esigenti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Inizia ora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-800"
                onClick={() => window.open('https://wa.me/34637054490?text=Ciao! Sono interessato al servizio CV digitale per studenti. Vorrei maggiori informazioni.', '_blank')}
              >
                Chatta su WhatsApp
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}