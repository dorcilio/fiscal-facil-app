<template>
  <div class="privacy-content">
    <div class="text-h5 q-mb-md text-primary">Política de Privacidade</div>

    <div class="text-caption text-grey-6 q-mb-lg">
      Última atualização: {{ lastUpdated }}
    </div>

    <div class="text-body1 line-height-relaxed">
      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          1. Informações que Coletamos
        </h6>
        <p>
          Coletamos diferentes tipos de informações para fornecer e melhorar
          nossos serviços:
        </p>

        <div class="q-ml-md q-mb-md">
          <h6 class="text-subtitle1 text-weight-medium">
            Informações Pessoais:
          </h6>
          <ul>
            <li>Nome completo e dados de identificação</li>
            <li>Endereço de e-mail e telefone</li>
            <li>Endereço físico e informações de cobrança</li>
            <li>Documentos fiscais (CPF, CNPJ, Inscrição Estadual)</li>
          </ul>
        </div>

        <div class="q-ml-md q-mb-md">
          <h6 class="text-subtitle1 text-weight-medium">Informações de Uso:</h6>
          <ul>
            <li>Logs de acesso e atividades no sistema</li>
            <li>Endereço IP e informações do dispositivo</li>
            <li>Dados de navegação e preferências</li>
            <li>Informações sobre transações e operações fiscais</li>
          </ul>
        </div>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          2. Como Usamos suas Informações
        </h6>
        <p>Utilizamos suas informações para:</p>
        <ul class="q-ml-md">
          <li>Fornecer e manter nossos serviços</li>
          <li>Processar transações e emitir documentos fiscais</li>
          <li>Comunicar sobre atualizações e mudanças no serviço</li>
          <li>Melhorar a experiência do usuário</li>
          <li>Cumprir obrigações legais e regulamentares</li>
          <li>Detectar e prevenir fraudes</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          3. Compartilhamento de Informações
        </h6>
        <p>
          Não vendemos, alugamos ou compartilhamos suas informações pessoais com
          terceiros, exceto nas seguintes situações:
        </p>
        <ul class="q-ml-md">
          <li>Com órgãos governamentais quando exigido por lei</li>
          <li>Com prestadores de serviços que nos auxiliam na operação</li>
          <li>Em caso de fusão, aquisição ou venda de ativos</li>
          <li>Para proteger nossos direitos legais</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">4. Segurança dos Dados</h6>
        <p>
          Implementamos medidas de segurança técnicas e organizacionais para
          proteger suas informações pessoais:
        </p>
        <ul class="q-ml-md">
          <li>Criptografia de dados em trânsito e em repouso</li>
          <li>Controles de acesso rigorosos</li>
          <li>Monitoramento contínuo de segurança</li>
          <li>Backups regulares e seguros</li>
          <li>Treinamento de equipe em segurança da informação</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">5. Seus Direitos (LGPD)</h6>
        <p>
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os
          seguintes direitos:
        </p>
        <ul class="q-ml-md">
          <li>Confirmação da existência de tratamento de dados</li>
          <li>Acesso aos seus dados pessoais</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados</li>
          <li>Anonimização, bloqueio ou eliminação de dados</li>
          <li>Portabilidade dos dados</li>
          <li>Eliminação dos dados tratados com consentimento</li>
          <li>Revogação do consentimento</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">6. Retenção de Dados</h6>
        <p>
          Mantemos suas informações pessoais pelo tempo necessário para cumprir
          as finalidades descritas nesta política, incluindo:
        </p>
        <ul class="q-ml-md">
          <li>Período exigido por obrigações legais e fiscais</li>
          <li>Tempo necessário para resolução de disputas</li>
          <li>Prazo para exercício de direitos em processos judiciais</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          7. Cookies e Tecnologias Similares
        </h6>
        <p>
          Utilizamos cookies e tecnologias similares para melhorar sua
          experiência, incluindo cookies essenciais, de performance e
          funcionais.
        </p>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">8. Contato e DPO</h6>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre esta política,
          entre em contato com nosso Encarregado de Proteção de Dados (DPO):
        </p>
        <div class="q-ml-md">
          <p><strong>E-mail:</strong> dpo@fiscalfacil.com.br</p>
          <p><strong>Telefone:</strong> (11) 1234-5678</p>
          <p><strong>Endereço:</strong> Rua das Empresas, 123 - São Paulo/SP</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style scoped>
.privacy-content {
  max-width: 800px;
}

.line-height-relaxed {
  line-height: 1.6;
}

section p {
  margin-bottom: 1rem;
  text-align: justify;
}

section ul {
  margin-bottom: 1rem;
}

section li {
  margin-bottom: 0.5rem;
}
</style>
