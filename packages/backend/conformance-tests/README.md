# Estratégia de Testes de Conformidade — Backend

Esta área organiza os testes que validam se a instância do Backstage está em conformidade com os comportamentos esperados de uma Internal Developer Platform (IDP), considerando a composição de múltiplos componentes: serviços core, extensões internas e plugins de comunidade.

O objetivo não é revalidar a lógica interna de cada componente — esse tipo de validação permanece próxima ao código, seguindo o modelo de co-location adotado pelo Backstage com Jest —, mas sim garantir o contrato de integração da plataforma como sistema composto: configuração, composição do backend, APIs expostas, comportamento em ambientes integrados e saúde operacional.

---

## 📁 Estrutura de Pastas

Todos os testes relacionados a um mesmo componente ficam organizados em uma única pasta.

Essa organização facilita a gestão do ciclo de vida dos componentes (instalação, atualização e remoção) sem introduzir dependências estruturais entre os conjuntos de testes.

```text
packages/
  backend/
    conformance-tests/
      community-plugins/
        <plugin-name>/
          <test-files>
      core-services/
        <service-name>/
          <test-files>
      upstream-plugins/
        <plugin-name>/
          <test-files>
      custom-plugins/
        <plugin-name>/
          <test-files>
      external-integrations/
        <integration-name>/
          <test-files>
```

### Racional

* `conformance-tests/`: Contém os testes que validam se a plataforma está conforme os contratos e comportamentos esperados quando seus componentes estão integrados. Esses testes validam o sistema como uma plataforma composta, e não componentes isolados.

  * `community-plugins/`: Agrupa testes de plugins mantidos pela comunidade, conforme a definição de [Community Plugins no Backstage](https://backstage.io/blog/2024/04/19/community-plugins/).

  * `core-services/`: Agrupa testes de contratos de infraestrutura do runtime do backend, conforme a definição de [Core Services no Backstage](https://backstage.io/docs/backend-system/core-services/index), permitindo detectar falhas estruturais antes que afetem os plugins.

  * `upstream-plugins/`: Agrupa testes de plugins mantidos pelo próprio Backstage, responsáveis por funcionalidades principais da plataforma, como Search, Software Catalog, Software Templates e TechDocs.

  * `external-integrations/`: Agrupa testes de integrações com serviços externos à plataforma, como provedores de identidade, SCM e serviços em nuvem.

  * `custom-plugins/`: Agrupa testes de plugins customizados para necessidades específicas da organização.

---

## Taxonomia de testes

Cada arquivo de teste segue o padrão:

`<surface>.<purpose>.<mode>.test.ts`

Quando for necessário separar uma suíte operacional (por exemplo, smoke), utilizamos um qualificador opcional:

`<surface>.<purpose>.<mode>.<qualifier>.test.ts`

### Surface — Fronteira técnica validada

Define qual parte do sistema está sendo exercitada.

| Valor | Descrição |
|--------|-------------|
| `config` | Arquivos e contratos de configuração |
| `backend` | Composição e wiring do backend |
| `api` | Endpoints e contratos HTTP |

### Purpose — Objetivo da validação

Define o tipo de comportamento verificado.

| Valor | Descrição |
|----------|-------------|
| `guardrail` | Restrições mínimas e validações de segurança |
| `wiring` | Composição e dependências entre componentes |
| `flows` | Fluxos funcionais e interações |
| `health` | Disponibilidade e prontidão operacional |

### Mode — Modelo de Execução

Define o nível de materialização do sistema necessário para que o teste seja executado.

| Valor | Descrição |
|-----------|-------------|
| `static` | Valida artefatos estáticos sem iniciar nenhum runtime |
| `inprocess` | Executa contra um runtime em memória utilizando harness |
| `deployed` | Executa contra uma instância de runtime totalmente implantada |

### Qualifier — Classificação operacional (opcional)

| Valor | Descrição |
|------|-----------|
| `smoke` | Verificação rápida e essencial, executada separadamente (ex.: pós-deploy) |
