<template>
  <div class="terms-content">
    <div class="text-h5 q-mb-md text-primary">Termos de Uso</div>

    <div class="text-caption text-grey-6 q-mb-lg">
      Última atualização: {{ lastUpdated }}
    </div>

    <div class="text-body1 line-height-relaxed">
      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">1. Aceitação dos Termos</h6>
        <p>
          Ao acessar e usar o sistema Fiscal Fácil, você concorda em cumprir e
          estar vinculado a estes Termos de Uso. Se você não concordar com
          qualquer parte destes termos, não deve usar nosso serviço.
        </p>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">2. Descrição do Serviço</h6>
        <p>
          O Fiscal Fácil é uma plataforma digital que oferece soluções para
          gestão fiscal e tributária, incluindo mas não limitado a:
        </p>
        <ul class="q-ml-md">
          <li>Emissão de notas fiscais eletrônicas</li>
          <li>Controle de tributos</li>
          <li>Relatórios fiscais</li>
          <li>Integração com órgãos governamentais</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          3. Cadastro e Conta do Usuário
        </h6>
        <p>Para utilizar nossos serviços, você deve:</p>
        <ul class="q-ml-md">
          <li>
            Fornecer informações precisas e atualizadas durante o cadastro
          </li>
          <li>Manter a confidencialidade de suas credenciais de acesso</li>
          <li>
            Notificar imediatamente sobre qualquer uso não autorizado de sua
            conta
          </li>
          <li>
            Ser responsável por todas as atividades realizadas em sua conta
          </li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">4. Uso Aceitável</h6>
        <p>Você concorda em não usar o serviço para:</p>
        <ul class="q-ml-md">
          <li>Atividades ilegais ou fraudulentas</li>
          <li>Violar direitos de propriedade intelectual</li>
          <li>Transmitir vírus ou códigos maliciosos</li>
          <li>Interferir no funcionamento do sistema</li>
          <li>Tentar acessar dados de outros usuários</li>
        </ul>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          5. Propriedade Intelectual
        </h6>
        <p>
          Todo o conteúdo, software, design e funcionalidades do Fiscal Fácil
          são propriedade exclusiva da empresa e estão protegidos por leis de
          direitos autorais e propriedade intelectual.
        </p>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          6. Limitação de Responsabilidade
        </h6>
        <p>
          O Fiscal Fácil não se responsabiliza por danos diretos, indiretos,
          incidentais ou consequenciais decorrentes do uso ou incapacidade de
          usar nossos serviços.
        </p>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">
          7. Modificações dos Termos
        </h6>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento.
          As alterações entrarão em vigor imediatamente após a publicação no
          sistema.
        </p>
      </section>

      <section class="q-mb-lg">
        <h6 class="text-h6 q-mb-sm text-secondary">8. Contato</h6>
        <p>
          Para dúvidas sobre estes Termos de Uso, entre em contato conosco
          através do e-mail: <strong>suporte@fiscalfacil.com.br</strong>
        </p>
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
.terms-content {
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
