# Documento de Requisitos: IDE Visual para Arduino (Projeto "Flowduino")

**Versão:** 1.2
**Data:** 02/09/2025

---

### 1. Visão Geral do Projeto

O projeto visa criar uma IDE (Ambiente de Desenvolvimento Integrado) baseada na web que permita a usuários, especialmente iniciantes e estudantes, programar microcontroladores da plataforma Arduino de forma visual e intuitiva. Através de uma interface de arrastar e soltar nós (nodes), o usuário constrói um fluxograma lógico que é automaticamente traduzido (transpilado) para código C++ funcional, eliminando a barreira da sintaxe e focando nos conceitos de lógica de programação e eletrônica.

---

### 2. Objetivos Principais

* **Democratizar o acesso:** Reduzir a curva de aprendizado inicial da programação de hardware.
* **Acelerar a prototipagem:** Permitir que makers e desenvolvedores criem protótipos funcionais de forma mais rápida e visual.
* **Fomentar a educação:** Servir como uma ferramenta educacional poderosa para o ensino de lógica, eletrônica e automação.

---

### 3. Público-Alvo

* **Estudantes:** Ensino fundamental, médio e superior em cursos de tecnologia e engenharia.
* **Hobbyistas e Makers:** Entusiastas que criam projetos pessoais de eletrônica e automação.
* **Educadores:** Professores que buscam ferramentas mais interativas para ensinar programação e eletrônica.

---

### 4. Requisitos Funcionais (RF) - O GRANDE PROJETO

#### 4.1. Interface e Canvas
* **RF01:** O sistema deve prover uma área de trabalho (canvas) infinita onde o usuário pode adicionar e manipular nós.
* **RF02:** O usuário deve ser capaz de dar zoom e arrastar (pan) o canvas.
* **RF03:** O sistema deve prover uma biblioteca de nós, categorizada por função (Entrada, Lógica, Saída, etc.).
* **RF04:** O usuário deve ser capaz de arrastar nós da biblioteca para o canvas.

#### 4.2. Nós e Conexões
* **RF05:** Cada nó deve ter pontos de entrada e saída claramente definidos.
* **RF06:** O usuário deve ser capaz de criar uma conexão (fio) arrastando de uma saída para uma entrada de outro nó.
* **RF07:** O sistema deve validar as conexões, permitindo apenas ligações entre tipos de dados compatíveis.
* **RF08:** O usuário deve ser capaz de deletar nós e conexões.
* **RF09:** O usuário deve ser capaz de criar "sub-circuitos" (nós customizados que encapsulam um fluxo interno).

#### 4.3. Geração de Código e Compilação
* **RF10:** O sistema deve possuir uma função para analisar o grafo de nós e conexões.
* **RF11:** O sistema deve traduzir (transpilar) o grafo visual em código C++ para Arduino.
* **RF12:** O código gerado deve ser exibido em um painel para o usuário poder copiar ou inspecionar.
* **RF13:** (Avançado) O sistema deve ser capaz de compilar e enviar o código para uma placa Arduino conectada via USB (usando a WebUSB API).

#### 4.4. Gerenciamento de Projetos
* **RF14:** O usuário deve ser capaz de criar uma conta e fazer login.
* **RF15:** O usuário deve ser capaz de salvar seus projetos na nuvem.
* **RF16:** O usuário deve ser capaz de carregar e editar projetos salvos.

---

### 5. Arquitetura e Estrutura de Código

* **Estrutura do Repositório:** O projeto será desenvolvido em um **Monorepo**, contendo as pastas `frontend` e `backend` no mesmo repositório Git para simplificar o desenvolvimento e a consistência.
* **Lógica de Transpilação:** A lógica de conversão do grafo visual para código **acontecerá no front-end (client-side)**. Isso garante feedback instantâneo para o usuário e permite o funcionamento offline do núcleo da aplicação.
* **Linguagem Alvo:** O código gerado será em **C++ para Arduino**, garantindo máxima compatibilidade com o ecossistema de hardware, bibliotecas e a comunidade maker.

---

### 6. Tecnologias Propostas

* **Front-end:**
    * **Framework:** React
    * **Interface de Nós:** React Flow
    * **Build Tool:** Vite
    * **Estilização:** TailwindCSS
* **Back-end:**
    * **Ambiente:** Node.js
    * **Linguagem:** TypeScript
    * **Framework API:** Express.js
* **Banco de Dados (Pós-MVP):**
    * **Tipo:** Relacional (Ex: PostgreSQL) para armazenar dados de usuários e projetos.
* **Ambiente de Desenvolvimento e Orquestração:**
    * **Containerização:** Docker
    * **Orquestração Local:** Docker Compose

---

### 7. Escopo do Protótipo de Apresentação (MVP - 2 Semanas)

Para entregar um protótipo de alto impacto em um prazo curto, focaremos em provar a funcionalidade central do projeto.

#### **Recursos INCLUÍDOS no MVP:**

* **Interface e Canvas:**
    * Um canvas funcional onde se pode arrastar nós. (Atende RF01, RF04)
    * Uma biblioteca de nós **limitada e fixa**.
* **Nós e Conexões:**
    * A biblioteca conterá apenas **3 nós essenciais**:
        1.  **[ENTRADA] Leitor de Pino Digital (Botão):** Com um campo para definir o número do pino.
        2.  **[LÓGICA] Porta NOT:** Inverte o sinal recebido.
        3.  **[SAÍDA] Escritor de Pino Digital (LED):** Com um campo para definir o número do pino.
    * O usuário poderá conectar esses 3 nós. (Atende RF05, RF06)
    * O usuário poderá deletar os nós e as conexões. (Atende RF08)
* **Geração de Código:**
    * Um botão "Gerar Código".
    * A lógica de transpilação para o cenário específico de "Botão -> NOT -> LED". (Atende RF10, RF11)
    * Um painel (modal) que exibe o código C++ gerado, pronto para ser copiado. (Atende RF12)

#### **Recursos EXCLUÍDOS do MVP:**

* Zoom e Pan no canvas.
* Validação avançada de conexões.
* Nós de "sub-circuito".
* Compilação e envio direto para a placa (faremos isso manualmente no simulador Wokwi).
* Contas de usuário, login e salvamento de projetos.
* Qualquer nó além dos 3 definidos acima.
