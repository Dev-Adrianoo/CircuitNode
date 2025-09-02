Documento de Requisitos: IDE Visual para Arduino (Projeto "Flowduino")
Versão: 1.3
Data: 02/09/2025

1. Visão Geral do Projeto
O projeto visa criar um laboratório de eletrônica virtual e interativo baseado na web. A plataforma funcionará como uma IDE visual onde usuários constroem circuitos usando nós que se assemelham a componentes de hardware reais (Arduinos, protoboards, LEDs, botões). A experiência principal é a simulação em tempo real do comportamento do circuito diretamente no navegador.

Como funcionalidade secundária, a ferramenta irá analisar o circuito virtual e traduzir (transpilar) o fluxograma em código C++ funcional para Arduino, servindo como uma ponte entre a experimentação virtual segura e a aplicação no mundo real.

2. Objetivos Principais
Permitir a experimentação segura: Oferecer um ambiente sem riscos onde usuários possam montar e testar circuitos sem medo de danificar componentes.

Fornecer feedback instantâneo: Simular o comportamento lógico e elétrico dos circuitos em tempo real.

Acelerar a prototipagem: Permitir que makers criem e validem a lógica de um protótipo visualmente antes de montar o hardware.

Democratizar o acesso: Reduzir a curva de aprendizado de eletrônica e programação através de uma interface visual e intuitiva.

3. Público-Alvo
Estudantes: Ensino fundamental, médio e superior em cursos de tecnologia e engenharia.

Hobbyistas e Makers: Entusiastas que criam projetos pessoais de eletrônica e automação.

Educadores: Professores que buscam ferramentas mais interativas para ensinar lógica, eletrônica e programação.

4. Requisitos Funcionais (RF) - O GRANDE PROJETO
4.1. Interface e Canvas
RF01: O sistema deve prover uma área de trabalho (canvas) que funcione como um laboratório virtual.

RF02: O usuário deve ser capaz de dar zoom e arrastar (pan) o canvas.

RF03: A biblioteca de nós deve apresentar componentes com uma aparência visual que remeta ao hardware real.

RF04: O usuário deve ser capaz de arrastar nós da biblioteca para o canvas.

4.2. Nós e Conexões
RF05: Cada nó deve ter pontos de conexão (pinos) claramente definidos e interativos.

RF06: A conexão entre nós deve ser representada visualmente como um "cabo virtual".

RF07: O usuário deve ser capaz de deletar nós e conexões.

RF08: O usuário deve ser capaz de criar "sub-circuitos" (ex: um "Nó de Protoboard" que encapsula uma lógica interna).

4.3. Modo Simulação (Experiência Principal)
RF09: O sistema deve possuir um "Modo Simulação" para executar a lógica do circuito em tempo real no navegador.

RF10: Nós de entrada (ex: Interruptor) devem ser interativos, permitindo ao usuário alterar seu estado (ligado/desligado).

RF11: O fluxo do sinal lógico (ex: HIGH/LOW) deve ser visualizado através dos cabos (ex: por mudança de cor).

RF12: Nós de saída (ex: LED) devem refletir visualmente seu estado em tempo real (ex: o nó do LED deve acender).

4.4. Modo Geração de Código (Ponte para o Real)
RF13: O sistema deve possuir uma função para analisar o grafo de nós e conexões.

RF14: O sistema deve traduzir o grafo visual em código C++ para Arduino.

RF15: O código gerado deve ser exibido em um painel para o usuário poder copiar ou inspecionar.

RF16: (Avançado) O sistema deve ser capaz de compilar e enviar o código para uma placa Arduino conectada via USB.

4.5. Gerenciamento de Projetos
RF17: O usuário deve ser capaz de criar uma conta e fazer login.

RF18: O usuário deve ser capaz de salvar seus projetos (o estado do laboratório virtual) na nuvem.

RF19: O usuário deve ser capaz de carregar e editar projetos salvos.

5. Arquitetura e Estrutura de Código
<!-- ... Seção inalterada ... -->

Estrutura do Repositório: O projeto será desenvolvido em um Monorepo.

Lógica de Execução/Transpilação: A lógica de simulação e de conversão para código acontecerá no front-end (client-side).

Linguagem Alvo: O código gerado será em C++ para Arduino.

6. Tecnologias Propostas
<!-- ... Seção inalterada ... -->

Front-end: React, React Flow, Vite, TailwindCSS

Back-end: Node.js, TypeScript, Express.js

Banco de Dados (Pós-MVP): PostgreSQL

Ambiente: Docker, Docker Compose

7. Escopo do Protótipo de Apresentação (MVP - 2 Semanas)
Para entregar um protótipo de alto impacto, nosso foco principal será na experiência de simulação interativa.

Recursos INCLUÍDOS no MVP:
Interface e Nós Visuais:

Um canvas funcional com React Flow.

Uma biblioteca com 3 nós essenciais com design simplificado:

[ENTRADA] Nó de Interruptor: Um componente clicável que alterna seu estado de saída (HIGH/LOW).

[LÓGICA] Nó NOT: Um bloco lógico que inverte o sinal recebido.

[SAÍDA] Nó de LED: Um componente que muda sua aparência (cor) com base no sinal de entrada.

Simulação Interativa:

O usuário poderá conectar os nós com "cabos virtuais".

A lógica do circuito será executada em tempo real no navegador.

O usuário poderá clicar no Interruptor e ver o nó de LED mudar de estado instantaneamente.

Geração de Código (Resultado da Simulação):

Após validar a lógica na simulação, um botão "Gerar Código" ficará disponível.

A ferramenta irá traduzir o cenário simulado (Interruptor -> NOT -> LED) para código C++ de Arduino.

O código será exibido em um painel para ser copiado.

Recursos EXCLUÍDOS do MVP:
Zoom e Pan, nós de Protoboard/Sub-circuito, contas de usuário, salvamento de projetos.

Aparência de hardware realista nos nós (usaremos um design funcional e limpo).

Envio direto para a placa (usaremos o simulador Wokwi para testar o código gerado).
